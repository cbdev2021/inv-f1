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
import { useUpdateRegisterMutation } from '../slices/registerApiSlice';


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
  addTypeValueMutation: any;
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
  addTypeValueMutation,
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
  const [updateTypeValue] = useUpdateRegisterMutation();

  useEffect(() => {
    // Este bloque de código se ejecutará cuando itemToUpdate cambie
    console.log("itemToUpdate ha cambiado en TableAddRegister:", itemToUpdate);

    // Realiza las acciones necesarias basadas en el cambio de itemToUpdate
  }, [itemToUpdate]);


  const [descRegistro, setDescRegistro] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.descRegistro : ""
  );
  const [monto, setMonto] = useState(
    itemToUpdate && typevalue === "Edit Register" ? itemToUpdate.monto : ""
  );
  const [fecha, setFecha] = useState(
    itemToUpdate && typevalue === "Edit Register" ? formatDate(itemToUpdate.fecha) : ""
  );

  useEffect(() => {
    if (itemToUpdate && typevalue === "Edit Register") {
      setDescRegistro(itemToUpdate.descRegistro);
      setMonto(itemToUpdate.monto);
      setFecha(formatDate(itemToUpdate.fecha));
    } else {
      // En caso de que itemToUpdate sea null u otra condición, puedes establecer los estados en un valor predeterminado
      setDescRegistro("");
      setMonto("");
      setFecha("");
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
    if (!monto || !fecha ) {
      if (!monto) {
        toast.error("El campo de valor numérico es obligatorio.");
      }
      if (!fecha) {
        toast.error("Debes seleccionar una fecha válida.");
      }
      // if (!descRegistro) {
      //   toast.error("Debes seleccionar un tipo.");
      // }
      return;
    }

    try {
      const response = await addTypeValueMutation({
        registro: {
          tipoRegistro: typevalue, //Mandatory
          descRegistro: descRegistro,
          fecha: fecha,
          monto: monto
        },
        token: token,
      });

      const newId = response.data._id;
      const newItem = { _id: newId, subtype: addNewSubtype, typevalue: typevalue };
      const updatedData = [...data, newItem];
      setAddNewSubtype("");
      updateData(updatedData, typevalue);
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
    setMonto((prevValue: string) => prevValue + number.toString());
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

    if (!monto || !fecha || !descRegistro) {
      if (!monto) {
        toast.error("El campo de valor numérico es obligatorio.");
      }
      if (!fecha) {
        toast.error("Debes seleccionar una fecha válida.");
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

    // if (editMode) {
    // Realiza la actualización del registro usando useUpdateRegisterMutation
    try {

      //const id = "6524d7308733a750efb0012b";
      //const id = rowId;

      //const itemToUpdate = dataRegisters.find((item) => item._id === id);

      console.log("itemToUpdate");
      console.log(itemToUpdate);

      if (!itemToUpdate) {
        console.error("Elemento no encontrado para actualizar");
        return;
      }

      const updatedItem = {
        tipoRegistro: itemToUpdate.tipoRegistro,
        descRegistro: descRegistro,
        fecha: fecha,
        monto: monto
      };

      // useUpdateRegisterMutation(
      //   {
      //     datos: {
      //       id: id,
      //       registro: updatedItem,
      //       token: token
      //     }
      //   }
      // );

      await updateTypeValue(
        {
          id: itemToUpdate._id,
          registro: updatedItem,
          token: token
        }
      );

      // Realiza las acciones necesarias después de la edición

      //setEditMode(false);
      refetch();
    } catch (error) {
      console.error("Error al editar el registro:", error);
    }
    // } else {
    //   // Realiza la adición de un nuevo registro
    //   // Resto del código para agregar un nuevo registro
    // }

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
              label="Numeric Value"
              variant="outlined"
              type="text"
              value={monto || ""}
              fullWidth
              onClick={openNumericKeyboard}
              onKeyPress={handleKeyPress}
            />
          </Grid>

          {/* DatePicker */}
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker
                label="Select Date"
                value={fecha}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setFecha(newValue);
                  }
                }}
              /> */}
              <DatePicker
                label="Select Date"
                value={dayjs(fecha)}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setFecha(newValue.format('MM-DD-YYYY'));
                    //setFecha(newValue.format('YYYY-MM-DD'));
                  }
                }}
              />

            </LocalizationProvider>
          </Grid>

          {/* Select Type */}
          <Grid item xs={12}>
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
          </Grid>

          {/* Botón para enviar el formulario */}
          {/* <Grid item xs={12}>
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
          </Grid> */}

          <Grid item xs={12}>
            {addButton}
          </Grid>

        </Grid>
      </div>

      <Dialog open={isNumericKeyboardOpen} onClose={closeNumericKeyboard}>
        <DialogTitle>New Value</DialogTitle>
        <DialogContent>
          <div>
            <Button onClick={() => handleNumericButtonClick(1)}>1</Button>
            <Button onClick={() => handleNumericButtonClick(2)}>2</Button>
            <Button onClick={() => handleNumericButtonClick(3)}>3</Button>
          </div>
          <div>
            <Button onClick={() => handleNumericButtonClick(4)}>4</Button>
            <Button onClick={() => handleNumericButtonClick(5)}>5</Button>
            <Button onClick={() => handleNumericButtonClick(6)}>6</Button>
          </div>
          <div>
            <Button onClick={() => handleNumericButtonClick(7)}>7</Button>
            <Button onClick={() => handleNumericButtonClick(8)}>8</Button>
            <Button onClick={() => handleNumericButtonClick(9)}>9</Button>
          </div>
          <div>
            <Button></Button>
            <Button onClick={() => handleNumericButtonClick(0)}>0</Button>
            <Button></Button>
          </div>
          <div>
            <Button onClick={() => setMonto("")}>Clear</Button>
            <Button onClick={closeNumericKeyboard}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default TableAddBilling;
