import { apiSlice } from './apiSlice';

// Reemplaza la URL correcta de tus servicios de valores de tipo

const TYPE_VALUES_URL = 'http://localhost:10000/api/products';
//const TYPE_VALUES_URL = 'https://inv-b1.vercel.app';

export const typeValuesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    addTypeValue: builder.mutation({
      query: (object) => ({
        url: `${TYPE_VALUES_URL}/add-products`,
        method: 'POST',
        body: object.registro,
        headers: {
          Authorization: `Bearer ${object.token}`,
        },
      }),
    }),
    updateTypeValue: builder.mutation({
      query: (object) => ({
        url: `${TYPE_VALUES_URL}/update-products/${object.data.id}`,
        method: 'PUT',
        body: object.data.registro,
        headers: {
          Authorization: `Bearer ${object.data.token}`,
        },
      }),
    }),    

    deleteTypeValue: builder.mutation({
      query: (object) => ({
        url: `${TYPE_VALUES_URL}/delete-products/${object.data.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${object.data.token}`,
        },
      }),
    }),
    
    getTypeValue: builder.query({
      query: (id, token) => ({
        url: `${TYPE_VALUES_URL}/get-products/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    //1
    getProductsByUserId: builder.query({
      query: (param) => {  //al parecer solo permite OBJETO de entrada!
        console.log("param:", param); // Agregar un console.log aquí
        return {
          url: `${TYPE_VALUES_URL}/get-products/${param.data.idUsuario}`,
          headers: {
            Authorization: `Bearer ${param.token}`, 
          },
        };
      },
    }),
  }),
});

export const {
  useAddTypeValueMutation,
  useUpdateTypeValueMutation,
  useDeleteTypeValueMutation,
  useGetTypeValueQuery,
  useGetProductsByUserIdQuery,
} = typeValuesApiSlice;
