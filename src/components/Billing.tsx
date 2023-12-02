import React, { FunctionComponent, useState, useEffect } from "react";
import {
    Container,
    CssBaseline,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    TextField,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";
//import { useGetTypeValuesByUserIdQuery } from '../slices/typeValuesApiSlice';
import { useGetInvoicesByUserIdQuery } from '../slices/invoicesApiSlice';
import { useSelector } from "react-redux";
import TableAddBilling from "./TableAddBilling";

import { Box, IconButton, Tab, Tabs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

//tabla registros
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useGetRegistersByCriteriaQuery } from '../slices/registerApiSlice'; // Import the hook
//import { useAddRegisterMutation } from '../slices/registerApiSlice';
import { useAddInvoiceMutation } from '../slices/invoicesApiSlice';
import { useDeleteInvoiceMutation } from '../slices/invoicesApiSlice';
import { CircularProgress } from "@mui/material";

function filterRecordsByMonthAndYear(records: any[], targetMonth: number, targetYear: number) {
    return records.filter((record: { fecha: string | number | Date; }) => {
        const recordDate = new Date(record.fecha);
        const recordMonth = recordDate.getMonth();
        const recordYear = recordDate.getFullYear();
        return recordMonth === targetMonth && recordYear === targetYear;
    });
}

type Record = {
    _id: string;
    tipoRegistro: string;
    descRegistro: string;
    fecha: string;
    monto: number;
    // Otros campos de tus registros
};



const Billing: FunctionComponent = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [spentData, setSpentData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [numericValue, setNumericValue] = useState("");
    const [addInvoiceMutation] = useAddInvoiceMutation();
    const [deleteInvoiceMutation] = useDeleteInvoiceMutation();
    const [rowId, setrowId] = useState("");
    const [dataEdit, setDataEdit] = useState([]);
    const [itemToUpdate, setItemToUpdate] = useState("");
    //const [filteredRecords, setFilteredRecords] = useState([]);
    //const [filtered, setFiltered] = useState<Record[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);

    // useEffect(() => {
    //     console.log("itemToUpdate ha cambiado:", itemToUpdate);  
    // }, [itemToUpdate]);

    useEffect(() => {
        console.log("itemToUpdate ha cambiado:", itemToUpdate); 
        setItemToUpdate(itemToUpdate);  
    }, [itemToUpdate]);


    const userId = useSelector((state: any) => state.auth.userInfo._id);
    const token = useSelector((state: any) => state.auth.token);
    const { data: dataResponse } = useGetInvoicesByUserIdQuery({
        idUsuario: userId,
        token: token,
    });

    const { data: dataResponseRegisters, isLoading, refetch } = useGetInvoicesByUserIdQuery({
        data: {
            idUsuario: userId,
        },
        token: token,
    });


    useEffect(() => {
        // Este efecto se ejecutará cuando dataResponseRegisters cambie
        // Aquí puedes realizar acciones adicionales si es necesario
        // Puedes acceder a dataResponseRegisters directamente

        if (dataResponseRegisters) {
            // Realizar acciones adicionales si es necesario
            // Por ejemplo, actualizar algún estado o realizar operaciones con los datos
        }
    }, [dataResponseRegisters]);

    useEffect(() => {
        if (dataResponse) {
            const spentDataMapped = dataResponse
                .filter((item: { typevalue: string; }) => item.typevalue === 'Purchase')
                .map((item: { _id: string; subtype: any; }) => ({
                    _id: item._id,
                    subtype: item.subtype
                }));

            const incomeDataMapped = dataResponse
                .filter((item: { typevalue: string; }) => item.typevalue === 'Sales')
                .map((item: { _id: string; subtype: any; }) => ({
                    _id: item._id,
                    subtype: item.subtype
                }));

            setSpentData(spentDataMapped);
            setIncomeData(incomeDataMapped);
        }
    }, [dataResponse]);

    const handleClickOpen = (title: string) => {
        setDialogTitle(title);
        setOpenDialog(true);
        setNumericValue("");
    };

    // const handleClose = () => {
    //     setOpenDialog(false);
    // };

    const handleClose = async () => {
        //await refetch();
        setOpenDialog(false);
    };


    const updateData = (newData: any, dataType: any) => {
        if (dataType === "Purchase") {
            setSpentData(newData);
        } else if (dataType === "Sales") {
            setIncomeData(newData);
        }
    };

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    //dialog tabla regs
    const [open, setOpen] = useState(false);

    const handleClickOpenRegisters = () => {
        refetch();
        setOpen(true);
    };

    const handleCloseRegisters = () => {
        setOpen(false);
        refetch();
    };

    const handleDelete = async (id: string) => {
        try {
            //await deleteTypeValueMutation(id);
            await deleteInvoiceMutation(
                {
                    registro: {
                        id: id
                    },
                    token: token
                }
            );

            refetch(); // Refrescar los datos desde la consulta
        } catch (error) {
            console.error("Error al eliminar el valor:", error);
        }
    };

    // const handleEdit = (title: string, rowId: string) => {
    //     setDialogTitle(title);
    //     setOpenDialog(true);
    //     setrowId(rowId);

    //     const itemToUpdate = dataResponseRegisters.find((item: { _id: string; }) => item._id === rowId);
    //     setItemToUpdate(itemToUpdate);

    //     // console.log("itemToUpdate: ");
    //     // console.log(itemToUpdate);

    //     // Pasa la función refetch al componente hijo
    //     const refetchFunction = async () => {
    //         await refetch();
    //         console.log("Data refetched successfully.");
    //     };

    //     const dataEdit =
    //         itemToUpdate.tipoRegistro === "Purchase" ? spentData :
    //             itemToUpdate.tipoRegistro === "Sales" ? incomeData :
    //                 [];

    //     // Pasa la función refetch al componente hijo
    //     // setDataEdit({ dataEdit, refetchFunction });
    // };

    // const handleEdit = async (title: string, rowId: string) => {
    //     setDialogTitle(title);
    //     setOpenDialog(true);
    //     setrowId(rowId);
    //     const itemToUpdate = dataResponseRegisters.find((item: { _id: string; }) => item._id === rowId);
    //     setItemToUpdate(itemToUpdate);
    //     const refetchFunction = async () => {
    //         await refetch();
    //         console.log("Data refetched successfully.");
    //     };
    //     await refetch();
    // };

    // const handleEdit = async (title: string, rowId: string) => {
    //     setDialogTitle(title);
    //     setOpenDialog(true);
    //     setrowId(rowId);
    
    //     const itemToUpdate = dataResponseRegisters.find((item: { _id: string; }) => item._id === rowId);
    //     setItemToUpdate(itemToUpdate);
    
    //     await refetch();  // Forzar la actualización antes de abrir el diálogo
    // };


    const handleEdit = async (title: string, rowId: string) => {
        setDialogTitle(title);
        setOpenDialog(true);
        setrowId(rowId);
      
        const itemToUpdate = dataResponseRegisters.find((item: { _id: string; }) => item._id === rowId);
        setItemToUpdate(itemToUpdate);
      
        // Esperar a que refetch se complete antes de abrir el diálogo
        await refetch();
      
        // Resto del código
      };
      




    useEffect(() => {
        if (dataResponseRegisters) {
            const filtered = filterRecordsByMonthAndYear(dataResponseRegisters, currentMonth, currentYear);
            setFilteredRecords(filtered);
        }
    }, [dataResponseRegisters, currentMonth, currentYear]);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 10);
    }, []);

    return (
        //<Container component="main" maxWidth="xs" sx={{ marginTop: 10, height: '540.5px' }}>
        <Container component="main" maxWidth="md" className={`fade-in-vertical ${isVisible ? 'active' : ''} common-styles`}>
            <CssBaseline />
            <div>
                <Typography variant="h5" align="center" gutterBottom>
                    Billing
                </Typography>

                <form className={"form"}>
                    <div className={"buttonsContainer"}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleClickOpen("Purchase")}
                            startIcon={<ShoppingCartIcon />}
                        >
                            Purchase Invoice
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleClickOpen("Sales")}
                            startIcon={<PaidIcon />}
                        >
                            Sales Invoice
                        </Button>
                    </div>

                    <Dialog
                        open={openDialog}
                        TransitionComponent={Slide}
                        keepMounted
                        onClose={handleClose}
                        //maxWidth="xs"
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogContent style={{ maxHeight: 400, overflowY: 'scroll' }}>
                            {dialogTitle === "Purchase" && (
                                <TableAddBilling
                                    userId={userId}
                                    title={dialogTitle}
                                    typevalue="Purchase"
                                    data={spentData}
                                    addInvoiceMutation={addInvoiceMutation}
                                    token={token}
                                    updateData={updateData}
                                    refetch={refetch}
                                    itemToUpdate={null}
                                />
                            )}
                            {dialogTitle === "Sales" && (
                                <TableAddBilling
                                    userId={userId}
                                    title={dialogTitle}
                                    typevalue="Sales"
                                    data={incomeData}
                                    addInvoiceMutation={addInvoiceMutation}
                                    token={token}
                                    updateData={updateData}
                                    refetch={refetch}
                                    itemToUpdate={null}
                                />
                            )}

                            {dialogTitle === "Edit Register" && (
                                <TableAddBilling
                                    userId={userId}
                                    title={dialogTitle}
                                    typevalue="Edit Register"
                                    data={dataEdit || []}
                                    //dataRegisters= {dataResponseRegisters}
                                    addInvoiceMutation={addInvoiceMutation}
                                    token={token}
                                    updateData={updateData}
                                    refetch={refetch}
                                    itemToUpdate={itemToUpdate}
                                />
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cerrar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </form>

                <div>
                    {/* <TableContainer component={Paper} style={{ maxHeight: "70vh", width: "100%" }}> */}
                    <TableContainer  >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell>ID</TableCell> */}
                                    <TableCell>Invoice ID</TableCell>
                                    <TableCell>invoice Type</TableCell>
                                    <TableCell>Date</TableCell>                                    
                                    <TableCell>Provider/Customer</TableCell>
                                    <TableCell>Payment</TableCell>
                                    <TableCell>Taxes</TableCell>
                                    <TableCell>Sub-total</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {/* {filteredRecords.length > 0 ? (
                                    filteredRecords.map((row: any) => ( */}
                                {dataResponseRegisters && dataResponseRegisters.length > 0 ? (
                                    dataResponseRegisters.map((row: any) => (
                                        <TableRow key={row._id}>                                         
                                            <TableCell>{row.invoiceID}</TableCell>
                                            <TableCell>{row.invoiceType}</TableCell>
                                            {/* <TableCell>{row.dateIssue}</TableCell> */}
                                            <TableCell>{new Date(row.dateIssue).toLocaleDateString('es-ES')}</TableCell>
                                            {/* <TableCell>{row.customer}</TableCell> */}
                                            {/* <TableCell>{row.invoiceType === 'Sales' ? row.provider : row.customer}</TableCell> */}
                                            <TableCell>{ row.provider? row.provider : row.customer}</TableCell>
                                            {/* <TableCell>{row.paymentSell}</TableCell> */}
                                            <TableCell>{ row.paymentSell? row.paymentSell : row.paymentBuy}</TableCell>


                                            <TableCell>{row.taxes}</TableCell>
                                            <TableCell>{row.subTotal}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="edit"
                                                    onClick={() => {
                                                        handleCloseRegisters();
                                                        handleEdit("Edit Register", row._id);
                                                    }}
                                                >
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleDelete(row._id)}
                                                >
                                                    <DeleteIcon color="secondary" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>No data available</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Container>
    );
};

export default Billing;

