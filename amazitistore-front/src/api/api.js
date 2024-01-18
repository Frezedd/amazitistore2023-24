import axios from 'axios';

export async function ProductsData() {
  try {
    // const responses = await axios.get('https://jsonserver.reactbd.com/phone');

    const response = await axios.get('https://fakestoreapiserver.vercel.app/amazonproducts');
    return response.data; 

  } catch (error) {
    console.error('Error fetching product data:', error);
    return []; 
  }
}