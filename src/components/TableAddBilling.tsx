import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Autocomplete,
  IconButton,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { useUpdateInvoiceMutation } from '../slices/invoicesApiSlice';
//import { useUpdateRegisterMutation } from '../slices/registerApiSlice';
import { useGetProductsByUserIdQuery } from '../slices/productApiSlice'; // Import the hook
//import { useAddProductMutation, useDeleteProductMutation } from '../slices/productApiSlice';
import { useAddProductInvoiceMutation } from '../slices/productInvoicesApiSlice';
import { useGetGenerateIdInvoiceQuery } from '../slices/invoicesApiSlice';


import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface TableConfigProps {
  userId: string;
  title: string;
  data: {
    _id: string;
    subtype: string;
  }[];
  typevalue: string;
  addInvoiceMutation: any;
  token: string;
  updateData: (newData: any, dataType: string) => void;
  refetch: () => void;
  itemToUpdate: any;

}

const TableAddBilling: FunctionComponent<TableConfigProps> = ({
  userId,
  title,
  data,
  typevalue,
  addInvoiceMutation,
  token,
  updateData,
  refetch,
  itemToUpdate
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubtype, setNewSubtype] = useState("");
  const [originalSubtype, setOriginalSubtype] = useState("");
  const [addNewSubtype, setAddNewSubtype] = useState("");
  const [isNumericKeyboardOpen, setIsNumericKeyboardOpen] = useState(true);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [addProductInvoiceMutation] = useAddProductInvoiceMutation();
  //const [getGenerateIdInvoice] = useGetGenerateIdInvoiceQuery();

  // const [invoiceId, setInvoiceId] = useState('');

  // // Llamada a la consulta para obtener el ID generado
  // const { data: generateIdData, error: generateIdError } = useGetGenerateIdInvoiceQuery({
  //   data: { invoiceId: typevalue },
  // });


  useEffect(() => {
    // Este bloque de código se ejecutará cuando itemToUpdate cambie
    console.log("itemToUpdate ha cambiado en TableAddRegister:", itemToUpdate);

    // Realiza las acciones necesarias basadas en el cambio de itemToUpdate
  }, [itemToUpdate]);


  const [descRegistro, setDescRegistro] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.descRegistro : ""
  );
  const [subTotal, setSubTotal] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.subTotal : ""
  );
  const [dateIssue, setDateIssue] = useState(
    itemToUpdate && typevalue === "Edit Register" ? formatDate(itemToUpdate.dateIssue) : ""
  );

  const [taxes, setTaxes] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.taxes : ""
  );

  const [invoiceID, setInvoiceID] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.invoiceID : ""
  );

  //venta
  const [customer, setCustomer] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.customer : ""
  );

  const [paymentSell, setPaymentSell] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.paymentSell : ""
  );

  //compra

  const [provider, setProvider] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.provider : ""
  );

  const [paymentBuy, setPaymentBuy] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.paymentBuy : ""
  );

  const paymentSellOptions = ['efectivo', 'tarjeta de crédito', 'tarjeta de débito', 'cheque', 'pago en línea'];

  // useEffect(() => {
  //   if (itemToUpdate && typevalue === "Edit Register") {
  //     setDescRegistro(itemToUpdate.descRegistro);
  //     setSubTotal(itemToUpdate.subTotal);
  //     setDateIssue(formatDate(itemToUpdate.dateIssue));
  //   } else {
  //     // En caso de que itemToUpdate sea null u otra condición, puedes establecer los estados en un valor predeterminado
  //     setDescRegistro("");
  //     setSubTotal("");
  //     setDateIssue("");
  //   }
  // }, [itemToUpdate, typevalue]);

  useEffect(() => {
    if (itemToUpdate && typevalue === "Edit Register") {
      const { descRegistro, subTotal, dateIssue, taxes, invoiceID, customer, paymentSell, provider, paymentBuy } = itemToUpdate;

      setDescRegistro(descRegistro || "");
      setSubTotal(subTotal || "");
      setDateIssue(formatDate(dateIssue) || "");
      setTaxes(taxes || "");
      setInvoiceID(invoiceID || "");
      setCustomer(customer || "");
      setPaymentSell(paymentSell || "");
      setProvider(provider || "");
      setPaymentBuy(paymentBuy || "");
    } else {
      // Establecer valores predeterminados si itemToUpdate es null o la operación no es de edición
      setDescRegistro("");
      setSubTotal("");
      setDateIssue("");
      setTaxes("");
      setInvoiceID("");
      setCustomer("");
      setPaymentSell("");
      setProvider("");
      setPaymentBuy("");
    }
  }, [itemToUpdate, typevalue]);

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0); // Forzar la zona horaria a UTC
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
    // return `${day}/${month}/${year}`;
  }

  // const handleEdit = (id: string) => {
  //   setEditingId(id);
  //   const currentItem = data.find((item) => item._id === id);
  //   if (currentItem) {
  //     setNewSubtype(currentItem.subtype);
  //     setOriginalSubtype(currentItem.subtype);
  //   }
  // };

  const { data: dataResponseRegisters, isLoading } = useGetProductsByUserIdQuery({
    data: {
      idUsuario: userId
    },
    token: token,
  });

  useEffect(() => {
    // Este efecto se ejecutará cuando dataResponseRegisters cambie
    // Aquí puedes realizar acciones adicionales si es necesario
    // Puedes acceder a dataResponseRegisters directamente

    console.log("dataResponseRegisters");
    console.log(dataResponseRegisters)



    if (dataResponseRegisters) {
      // Realizar acciones adicionales si es necesario
      // Por ejemplo, actualizar algún estado o realizar operaciones con los datos
    }
  }, [dataResponseRegisters]);

  const handleAdd = async () => {
    if (!subTotal || !dateIssue) {
      if (!subTotal) {
        toast.error("El campo de valor numérico es obligatorio.");
      }
      if (!dateIssue) {
        toast.error("Debes seleccionar una dateIssue válida.");
      }
      // if (!descRegistro) {
      //   toast.error("Debes seleccionar un tipo.");
      // }
      return;
    }

    try {
      const response = await addInvoiceMutation({
        registro: {
          //Mandatory fields
          invoiceID: invoiceID,
          invoiceType: typevalue,
          dateIssue: dateIssue,
          subTotal: subTotal,
          taxes: taxes,

          //compra
          customer: customer,
          paymentSell: paymentSell,
          //venta
          provider: provider,
          paymentBuy: paymentBuy,
        },
        token: token,
      });

      console.log("data:");
      console.log(data);

      // const newId = response.data._id;
      // const newItem = { _id: newId, subtype: addNewSubtype, typevalue: typevalue };
      // const updatedData = [...data, newItem];
      // setAddNewSubtype("");
      // updateData(updatedData, typevalue);
      refetch();
    } catch (error) {
      console.error("Error al agregar el nuevo valor:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewSubtype(originalSubtype);
  };

  const openNumericKeyboard = () => {
    setIsNumericKeyboardOpen(true);
  };

  const closeNumericKeyboard = () => {
    setIsNumericKeyboardOpen(false);
  };

  const handleNumericButtonClick = (number: number) => {
    setSubTotal((prevValue: string) => prevValue + number.toString());
  };

  const [invoiceId, setInvoiceId] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.invoiceID : ""
  );

  const { data: generateIdData, error: generateIdError } = useGetGenerateIdInvoiceQuery({
    data: { invoiceId: typevalue },
    token: token
  });

  useEffect(() => {

    console.log("generateIdData");
    console.log(generateIdData);


    if (generateIdData) {
      setInvoiceId(generateIdData.sequence_value);  // Ajusta según la estructura de tu respuesta
    }
  }, [generateIdData]);

  // Manejar errores si es necesario
  if (generateIdError) {
    console.error('Error obteniendo el ID generado:', generateIdError);
  }


  useEffect(() => {
    if (!editingId) {
      setAddNewSubtype("");
    }
  }, [editingId]);

  useEffect(() => {
    if (editingId && tableRef.current) {
      const rowElement = tableRef.current.querySelector(`#row-${editingId}`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [editingId, tableRef]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (editingId) {
        //handleSave(editingId);
      } else {
        handleAdd();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (editingId) {
        handleCancelEdit();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!subTotal || !dateIssue || !descRegistro) {
      if (!subTotal) {
        toast.error("El campo de valor numérico es obligatorio.");
      }
      if (!dateIssue) {
        toast.error("Debes seleccionar una dateIssue válida.");
      }
      if (!descRegistro) {
        toast.error("Debes seleccionar un tipo.");
      }
      return;
    }

    try {
      // ... (lógica de envío del formulario)
    } catch (error) {
      console.error("Error al agregar el nuevo valor:", error);
    }
  };

  const handleEdit = async () => {
    try {
      console.log("itemToUpdate");
      console.log(itemToUpdate);
      if (!itemToUpdate) {
        console.error("Elemento no encontrado para actualizar");
        return;
      }
      const updatedItem = {
        invoiceID: invoiceID,
        invoiceType: typevalue,
        dateIssue: dateIssue,
        //idUsuario: idUsuario,
        subTotal: subTotal,
        taxes: taxes,

        customer: customer,
        paymentSell: paymentSell,
        //venta
        provider: provider,
        paymentBuy: paymentBuy,

      };
      await updateInvoice(
        {
          id: itemToUpdate._id,
          registro: updatedItem,
          token: token
        }
      );
      refetch();
    } catch (error) {
      console.error("Error al editar el registro:", error);
    }
  };



  let addButton = null;
  if (typevalue === "Purchase" || typevalue === "Sales") {
    addButton = (
      <Button
        variant="contained"
        name="iniciar"
        id="idIniciar"
        color="primary"
        onClick={handleAdd}
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Add
      </Button>
    );
  } else if (typevalue === "Edit Register") {
    addButton = (
      <Button
        variant="contained"
        name="iniciar"
        id="idIniciar"
        color="primary"
        onClick={handleEdit}
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Edit
      </Button>
    );
  }

  const handlePaymentSellChange = (event: { target: { value: any; }; }) => {
    setPaymentSell(event.target.value);
  };

  const handlePaymentBuyChange = (event: { target: { value: any; }; }) => {
    setPaymentBuy(event.target.value);
  };

  //search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    invoiceID: number;
    invoiceType: string;
    productId: string;
    name: string;
    price: string;
    amount: string;
  }>>([]);
  const [selectedProduct, setSelectedProduct] = useState<{
    invoiceID: number;
    invoiceType: string;
    productId: string;
    name: string;
    price: string;
    amount: string;
  } | null>(null);
  const [confirmAddDialogOpen, setConfirmAddDialogOpen] = useState(false);


  const handleSearch = () => {
    const filteredResults = dataResponseRegisters.filter(
      (product: { name: string; productId: string; }) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  const handleAddToList = () => {
    if (selectedProduct) {
      setConfirmAddDialogOpen(true);
    }
  };

  const confirmAddToCart = () => {
    setSearchResults([...searchResults, selectedProduct!]);
    setSelectedProduct(null);
    setSearchTerm('');
    setConfirmAddDialogOpen(false);
  };

  const cancelAddToCart = () => {
    setConfirmAddDialogOpen(false);
  };

  // const handleDeleteFromList = (productIdToDelete: string) => {
  //   const updatedList = searchResults.filter((product) => product.productId !== productIdToDelete);
  //   setSearchResults(updatedList);
  // };

  // const handleDeleteFromList = (productIdToDelete: string) => {
  //   setSearchResults((prevResults) =>
  //     prevResults.filter((product) => product.productId !== productIdToDelete)
  //   );
  // };

  // const handleDeleteFromList = (productIdToDelete: string) => {
  //   console.log('Deleting product with ID:', productIdToDelete);
  //   setSearchResults((prevResults) => {
  //     const newResults = prevResults.filter((product) => product.productId !== productIdToDelete);
  //     console.log('New results:', newResults);
  //     return newResults;
  //   });
  // };

  const handleDeleteFromList = (productIdToDelete: string) => {
    console.log('Deleting product with ID:', productIdToDelete);
    console.log('Previous results:', searchResults);

    setSearchResults((prevResults) => {
      const newResults = prevResults.filter((product) => product.productId !== productIdToDelete);
      console.log('New results:', newResults);
      return newResults;
    });
  };

  // const handleConfirmAll = async () => {
  //   try {
  //     // Itera sobre los resultados y realiza la inserción para cada registro
  //     for (const product of searchResults) {
  //       product.invoiceID = generateIdData; 
  //      product.invoiceType = typevalue;     

  //       const response = await addProductInvoiceMutation({
  //         registro: product,
  //         token: token,
  //       });

  //       // Puedes imprimir en la consola la respuesta si lo necesitas
  //       console.log('Respuesta de la inserción:', response);
  //     }

  //     // Limpia la lista después de confirmar todos los productos
  //     setSearchResults([]);
  //     // Puedes agregar aquí cualquier lógica adicional después de la confirmación de todos los productos

  //     // Notifica al usuario que todos los productos han sido confirmados
  //     toast.success('Todos los productos han sido confirmados exitosamente');
  //   } catch (error) {
  //     console.error('Error al confirmar los productos:', error);
  //     // Maneja el error según sea necesario
  //     toast.error('Hubo un error al confirmar los productos');
  //   }
  // };

  const handleConfirmAll = async () => {
    try {
      // Itera sobre los resultados y realiza la inserción para cada registro
      for (const originalProduct of searchResults) {
        // Crea un nuevo objeto extendiendo el original
        const product = { ...originalProduct };

        // Agrega las propiedades invoiceID e invoiceType
        product.invoiceID = generateIdData.sequence_value;
        product.invoiceType = typevalue;

        const response = await addProductInvoiceMutation({
          registro: product,
          token: token,
        });

        // Puedes imprimir en la consola la respuesta si lo necesitas
        console.log('Respuesta de la inserción:', response);
      }

      // Limpia la lista después de confirmar todos los productos
      setSearchResults([]);
      // Puedes agregar aquí cualquier lógica adicional después de la confirmación de todos los productos

      // Notifica al usuario que todos los productos han sido confirmados
      toast.success('Todos los productos han sido confirmados exitosamente');
    } catch (error) {
      console.error('Error al confirmar los productos:', error);
      // Maneja el error según sea necesario
      toast.error('Hubo un error al confirmar los productos');
    }
  };


  return (
    <form onSubmit={handleAdd}>
      <div>
        <Typography variant="h6" gutterBottom>
          {/* Add {title} */}
          {title}
        </Typography>

        <Grid container spacing={2}>
          {/* <Grid item xs={12} style={{ width: '50%' }}>
            <TextField
              label="Invoice ID"
              variant="outlined"
              type="text"
              value={invoiceId || ""}
              fullWidth
              onChange={(e) => setInvoiceId(e.target.value)}
            />
          </Grid> */}

          <Grid item xs={12} style={{ width: '50%' }}>
            <TextField
              label="Invoice ID"
              variant="outlined"
              type="text"
              value={invoiceId}
              fullWidth
              onChange={(e) => setInvoiceId(e.target.value)}
            />
          </Grid>



          <Grid item xs={6}>
            {(typevalue === 'Purchase' || (itemToUpdate && (typevalue === 'Edit Register' && itemToUpdate.invoiceType === 'Purchase'))) && (

              <TextField
                label="Provider"
                variant="outlined"
                type="text"
                value={provider || ""}
                fullWidth
                onChange={(e) => setProvider(e.target.value)}
              />
            )}
          </Grid>

          <Grid item xs={6}>
            {(typevalue === 'Purchase' || (itemToUpdate && (typevalue === 'Edit Register' && itemToUpdate.invoiceType === 'Purchase'))) && (

              <FormControl fullWidth>
                <InputLabel id="paymentSell-label">Payment Buy</InputLabel>
                <Select
                  labelId="paymentSell-label"
                  id="paymentSell"
                  value={paymentBuy}
                  onChange={handlePaymentBuyChange}
                  label="Payment Buy"
                >
                  {paymentSellOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          <Grid item xs={6}>
            {(typevalue === 'Sales' || (itemToUpdate && (typevalue === 'Edit Register' && itemToUpdate.invoiceType === 'Sales'))) && (

              <TextField
                label="Customer"
                variant="outlined"
                type="text"
                value={customer || ""}
                fullWidth
                onChange={(e) => setCustomer(e.target.value)}
              />
            )}
          </Grid>

          <Grid item xs={6}>
            {(typevalue === 'Sales' || (itemToUpdate && (typevalue === 'Edit Register' && itemToUpdate.invoiceType === 'Sales'))) && (
              <FormControl fullWidth>
                <InputLabel id="paymentSell-label">Payment Sell</InputLabel>
                <Select
                  labelId="paymentSell-label"
                  id="paymentSell"
                  value={paymentSell}
                  onChange={handlePaymentSellChange}
                  label="Payment Sell"
                >
                  {paymentSellOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Taxes"
              variant="outlined"
              type="text"
              value={taxes || ""}
              fullWidth
              onChange={(e) => setTaxes(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Sub Total"
              variant="outlined"
              type="text"
              value={subTotal || ""}
              fullWidth
              onChange={(e) => setSubTotal(e.target.value)}
            />
          </Grid>

          {/* DatePicker */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={dayjs(dateIssue)}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setDateIssue(newValue.format('MM-DD-YYYY'));
                    //setFecha(newValue.format('YYYY-MM-DD'));
                  }
                }}
              />

            </LocalizationProvider>
          </Grid>

          {/* <Grid item xs={6}>
            {addButton}
          </Grid> */}

        </Grid>
      </div>

      {/* <div>
        <TextField
          label="Search by Name or ProductID"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div> */}

      <Autocomplete
        options={dataResponseRegisters}
        getOptionLabel={(option) => option.name}
        value={selectedProduct}
        onChange={(_, newValue) => setSelectedProduct(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search by Name or ProductID"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>

      <Button variant="contained" color="primary" onClick={handleAddToList} disabled={!selectedProduct}>
        Add to List
      </Button>

      <div style={{ marginTop: '20px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.productId}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.amount}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteFromList(product.productId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* <Button
        variant="contained"
        color="primary"
        onClick={handleConfirmAll}
        fullWidth
        sx={{ marginTop: 2 }}
        disabled={searchResults.length === 0} // Deshabilita el botón si no hay productos para confirmar
      >
        Confirmar Todo
      </Button> */}

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleAdd();
          //handleAddToList();
          handleConfirmAll();
        }}
        fullWidth
        sx={{ marginTop: 2 }}
        //disabled={!selectedProduct}
      >
        Generar Factura
      </Button>

      <Dialog open={confirmAddDialogOpen} onClose={cancelAddToCart}>
        <DialogTitle>Confirm Add to List</DialogTitle>
        <DialogContent>
          Are you sure you want to add {selectedProduct?.name} to the list?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAddToCart} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmAddToCart} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </form>



  );
};

export default TableAddBilling;
