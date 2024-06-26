import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, { dbName: 'carrent' });
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50;
  const kmFactor = 0.2;
  const ageFactor = 10;

  const kmRate = city_mpg * kmFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  const rentalRatePerDay = basePricePerDay + kmRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

export const getSumFromDate = (pickupDate: any, dropDate: any) => {
  const date1 = new Date(pickupDate);
  const date2 = new Date(dropDate);

  const diffreneceInMs: number = Math.abs(date2.getTime() - date1.getTime());
  const differenceInDays: number = Math.ceil(
    diffreneceInMs / (1000 * 60 * 60 * 24)
  );
  return differenceInDays;
};

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};

export const updateDateFormat = (date: string) => {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
  });
  return formattedDate;
};

export const todayDate = () => {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};
