import User from "../models/user.model.js"
import bcrypt, { getSalt } from "bcryptjs"
import getToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"

export const signUp = async (req, res) => {
    try {
        const {fullName, email, password, mobileNo, role} = req.body
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: "User already exists."})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters."})
        }
        if(mobileNo.length < 10){
            return res.status(400).json({message: "Mobile number must be atleast 10 digits."})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            fullName,
            email,
            role,
            mobileNo,
            password: hashedPassword
        })
        const token = await getToken(user._id)
        res.cookie("token",token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json(`sign up error ${error}`)
    }
}

export const signIn = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "User doesn't exists."})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "Incorrect Password"})   
        }

        
        const token = await getToken(user._id)
        res.cookie("token",token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(`sign in error ${error}`)
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        return res.status(500).json(`sign out error ${error}`)
    }
}

export const sendOtp = async(req,res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exist."})
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false
        await user.save()
        await sendOtpMail(email,otp)
        return res.status(200).json({message:"otp sent successfully"})
    } catch (error) {
        return res.status(500).json(`send otp error ${error}`)
    }
}

export const verifyOtp = async(req,res) => {
    try {
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user ||user.resetOtp != otp || user.otpExpires < Date.now()){
            return res.status(400).json({message:"invalid/expired otp"})
        } 
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({message:"otp verified successfully"})
    } catch (error) {
        return res.status(500).json(`verify otp error ${error}`)
    }
}

export const resetPassword = async(req,res) => {
    try {
        const {email, newPassword} = req.body
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"otp verification required"})
        }
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({message:"password reset successfully"})
    } catch (error) {
        return res.status(500).json({message:`reset password error ${error}`})
    }
}

export const googleAuth = async(req,res) => {
    try {
        console.log('Google auth request body:', req.body);
        
        const {fullName, email, mobile} = req.body
        
        let user = await User.findOne({email})
        console.log('User found:', user);
        
        if(!user){
            user = await User.create({
                fullName, 
                email, 
                mobileNo: mobile, // Change to mobileNo
                role: "user", // Add default role
                isEmailVerified: true, // Google users have verified email
                provider: "google" // Mark as Google user
            })
        } else {
            // Update mobile if provided and not already set
            if (mobile && !user.mobileNo) {
                user.mobileNo = mobile // Change to mobileNo
                await user.save()
            }
        }
        
        const token = await getToken(user._id)
        res.cookie("token",token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        
        return res.status(200).json(user)
    } catch (error) {
        console.error('Google auth error:', error);
        return res.status(500).json({message: `googleAuth error: ${error.message}`})
    }
}