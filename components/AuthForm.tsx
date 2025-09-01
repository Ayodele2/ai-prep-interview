"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"

/**
 * Type definition for the authentication form type
 */
type FormType = 'sign-in' | 'sign-up'

/**
 * Creates a Zod schema for form validation based on the form type
 * @param type - The type of authentication form ('sign-in' or 'sign-up')
 * @returns Zod schema object for form validation
 */
const authFormSchema = (type: FormType) => {
  return z.object({
    // Name field is required only for sign-up, optional for sign-in
    name: type === 'sign-up' ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
    // Email validation for both forms
    email: z.string().email("Please enter a valid email address"),
    // Password validation with minimum length requirement
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
}

/**
 * Props interface for the AuthForm component
 */
interface AuthFormProps {
  /** The type of form to render - either 'sign-in' or 'sign-up' */
  type: FormType
}

/**
 * AuthForm Component
 * 
 * A reusable authentication form component that handles both sign-in and sign-up flows.
 * Features form validation, error handling, and navigation between different auth states.
 * 
 * @param props - The component props
 * @param props.type - Determines whether to show sign-in or sign-up form
 * 
 * @example
 * ```tsx
 * // For sign-in form
 * <AuthForm type="sign-in" />
 * 
 * // For sign-up form
 * <AuthForm type="sign-up" />
 * ```
 */
const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)

  /**
   * Initialize the form with react-hook-form and Zod validation
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  /**
   * Form submission handler
   * Processes the form data and handles navigation/feedback based on form type
   * 
   * @param values - The validated form data
   */
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Log form values for debugging (remove in production)
      console.log("Form submitted with values:", values)

      if (type === 'sign-up') {
        // Handle sign-up logic here
        // TODO: Implement actual user registration API call
        toast.success('Account created successfully. Please sign in.')
        router.push('/sign-in')
      } else {
        // Handle sign-in logic here
        // TODO: Implement actual user authentication API call
        toast.success('Signed in successfully.')
        router.push('/')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error(`There was an error: ${error}`)
    }
  }

  // Determine if this is a sign-in form for conditional rendering
  const isSignIn = type === 'sign-in'

  return (
    <div className="card-border lg:min-w-[560px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        {/* Logo and App Name */}
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" height={32} width={38} alt="PrepWise Logo" />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        {/* App Description */}
        <h3 className="text-center">
          Practice job interview with AI
        </h3>

        {/* Authentication Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-6 form">
            {/* Name field - only shown for sign-up */}
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter your name"
              />
            )}

            {/* Email field - shown for both forms */}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email address"
              type="email"
            />

            {/* Password field - shown for both forms */}
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            {/* Submit button with dynamic text */}
            <Button className="btn" type="submit">
              {isSignIn ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Form>

        {/* Navigation link to switch between sign-in and sign-up */}
        <p className="text-center font-bold">
          {isSignIn ? 'No account yet?' : 'Have an account already? '}
          <Link 
            href={!isSignIn ? '/sign-in' : '/sign-up'} 
            className="font-bold text-user-primary ml-1 text-white"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm

/**
 * Usage Notes:
 * 
 * 1. This component requires the following dependencies:
 *    - @hookform/resolvers/zod
 *    - react-hook-form
 *    - zod
 *    - sonner (for toast notifications)
 *    - next/navigation (for routing)
 *    - next/image (for optimized images)
 * 
 * 2. Required UI components:
 *    - Button, Form, Input from your UI library
 *    - Custom FormField component
 * 
 * 3. Assets:
 *    - /logo.svg image file in your public directory
 * 
 * 4. CSS classes:
 *    - Ensure you have the required CSS classes defined:
 *      card-border, card, text-primary-100, btn, text-user-primary, form
 * 
 * 5. TODO items for production:
 *    - Replace console.log with actual API calls
 *    - Implement real authentication logic
 *    - Add loading states during form submission
 *    - Add proper error handling for network requests
 *    - Consider adding password strength requirements
 *    - Add form field validation feedback
 */