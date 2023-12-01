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


  return (
    <form onSubmit={handleAdd}>
      <div>
        <Typography variant="h6" gutterBottom>
          Add {title}
        </Typography>

        <Grid container spacing={2}>
          {/* Numeric Value */}
          <Grid item xs={12}>
            <TextField
              label="Sub total"
              variant="outlined"
              type="text"
              value={subTotal || ""}
              fullWidth
              onChange={(e) => setSubTotal(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Taxes"
              variant="outlined"
              type="text"
              value={taxes || ""}
              fullWidth
              onChange={(e) => setTaxes(e.target.value)}
            />
          </Grid>

          {/* DatePicker */}
          <Grid item xs={12}>
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

          {/* Select Type */}
          {/* <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={descRegistro}
                onChange={(e) => setDescRegistro(e.target.value as string)}
              >
                {data.map((item) => (
                  <MenuItem key={item._id} value={item.subtype}>
                    {item.subtype}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          <Grid item xs={12}>
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

          <Grid item xs={12}>
            {(typevalue === 'Sales' || (itemToUpdate && (typevalue === 'Edit Register' && itemToUpdate.invoiceType === 'Sales'))) && (

              <TextField
                label="customer"
                variant="outlined"
                type="text"
                value={customer || ""}
                fullWidth
                onChange={(e) => setCustomer(e.target.value)}
              />
            )}
          </Grid>

          <Grid item xs={12}>
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

          <Grid item xs={12}>
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

          <Grid item xs={12}>
            {addButton}
          </Grid>

        </Grid>
      </div>
    </form>
  );
};

export default TableAddBilling;
