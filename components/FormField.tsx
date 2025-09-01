import React from 'react'
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Controller, Control, FieldValues, Path } from "react-hook-form";


interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name:  path<T>
  label: string
  type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = ({ control, name, label, placeholder, type = "text"}:  FormFieldProps<T>) => (
    
      <Controller  
      control={control}
      name={name}
      render={({ field }) => (

          <FormItem>
              <FormLabel className='label'>{label}</FormLabel>
              <FormControl>
                <Input 
                className='input'
                placeholder={placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>

          
        )} 
          
      />
)

export default FormField