import mongoose from 'mongoose'

import { CarCardProps } from '@/types'

let isConnected = false

export const connectToDB = async () => {
  mongoose.set('strictQuery', true) // Строграя проверка запросов

  if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found')
  if (isConnected) {
    console.log('Already connected to MongoDB')
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, { dbName: 'carrent' })
    console.log('Connected to MongoDB')
    isConnected = true
  } catch (error) {
    console.log(error)
  }
}

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 60 // Base rental price per day in dollars
  const mileageFactor = 0.1 // Additional rate per mile driven
  const ageFactor = 0.05 // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor
  const ageRate = (new Date().getFullYear() - year) * ageFactor

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate

  return rentalRatePerDay.toFixed(0)
}

export const updateSearchParams = (type: string, value: string) => {
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search)

  // Set the specified search parameter to the given value
  searchParams.set(type, value)

  // Set the specified search parameter to the given value
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`

  return newPathname
}

export const generateCarImageUrl = (car: CarCardProps, angle?: string) => {
  const url = new URL('https://cdn.imagin.studio/getImage')

  const { make, year, model } = car

  url.searchParams.append(
    'customer',
    process.env.NEXT_PUBLIC_IMAGIN_API_KEY || ''
  )
  url.searchParams.append('make', make)
  url.searchParams.append('modelFamily', model.split(' ')[0])
  url.searchParams.append('zoomType', 'fullscreen')
  url.searchParams.append('modelYear', `${year}`)
  url.searchParams.append('angle', `${angle}`)

  return `${url}`
}
