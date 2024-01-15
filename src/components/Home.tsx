import React, { FunctionComponent, useEffect, useState } from "react";
import { Container, CssBaseline, Typography, IconButton, Box, Tab, Tabs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
// import { useGetRegistersByCriteriaQuery } from "../slices/registerApiSlice";
// import { useGetInvoicesByUserIdQuery } from '../slices/invoicesApiSlice';
import { useGetProductsByUserIdInvoiceQuery } from '../slices/productInvoicesApiSlice';

import Switch from '@mui/material/Switch';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

const Home: FunctionComponent = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [filterByType, setFilterByType] = useState('Purchase');

    const userId = useSelector((state: any) => state.auth.userInfo._id);
    const token = useSelector((state: any) => state.auth.token);

    const { data: dataResponseRegisters } = useGetProductsByUserIdInvoiceQuery({
        data: {
            idUsuario: userId,
        },
        token: token,
    });

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    //const years = Array.from({ length: 3 }, (_: any, i: number) => currentYear - 1 + i);
    //const allDates = years.map((year: any) => months.map((month) => `${month} ${year}`)).flat();

    const years = Array.from({ length: 3 }, (_: any, i: number) => currentYear - 1 + i);
    const allDates = years.map((year: any) => `${year}`);



    const handleNextDate = () => {
        const currentIndex = allDates.indexOf(`${currentYear}`);
        if (currentIndex < allDates.length - 1) {
            const selectedYear = allDates[currentIndex + 1];
            setCurrentYear(Number(selectedYear));
        }
    };

    const handlePreviousDate = () => {
        const currentIndex = allDates.indexOf(`${currentYear}`);
        if (currentIndex > 0) {
            const selectedYear = allDates[currentIndex - 1];
            setCurrentYear(Number(selectedYear));
        }
    };

    type Record = {
        totalSales: number;
        _id: string;
        idUsuario: string;
        invoiceType: string;
        invoiceID: number;
        productId: number;
        name: string;
        description: string;
        price: number;
        amount: number;
        createdAt: string;
        updatedAt: string;
        utility: number;
        dateIssue: string;
    };

    // function filterRecordsByMonthAndYear(records: any[], targetMonth: number, targetYear: number) {
    //     if (!records) {
    //         return [];
    //     }

    //     return records.filter((record) => {
    //         const recordDate = new Date(record.dateIssue);
    //         const recordMonth = recordDate.getMonth();
    //         const recordYear = recordDate.getFullYear();
    //         console.log("recordYear:");
    //         console.log(recordYear);

    //         //return recordMonth === targetMonth && recordYear === targetYear;
    //         return recordYear === targetYear;
    //     });
    // }

    function filterRecordsByYear(records: any[], targetYear: number) {
        if (!records) {
            return [];
        }

        return records.filter((record) => {
            const recordDate = new Date(record.dateIssue);
            const recordYear = recordDate.getFullYear();

            return recordYear === targetYear;
        });
    }

    const handleTabClick = (event: React.SyntheticEvent, newValue: number) => {
        const selectedYear = allDates[newValue];
        setCurrentYear(Number(selectedYear));
    };

    let sumaDeValores = 0;
    if (dataResponseRegisters) {
        console.log('Reports - dataResponseRegisters:');
        console.log(dataResponseRegisters);

        sumaDeValores = dataResponseRegisters.reduce((total: any, item: { subTotal: any }) => total + item.subTotal, 0);
    }

    // const registrosDelMesSeleccionado = filterRecordsByMonthAndYear(dataResponseRegisters, currentMonth, currentYear);
    const registrosDelYearSeleccionado = filterRecordsByYear(dataResponseRegisters, currentYear);


    // Agrupa registros por "descRegistro" y asigna colores
    console.log("registrosDelYearSeleccionado:");
    console.log(registrosDelYearSeleccionado);



    const tipoColores: { [key: string]: string } = {};

    registrosDelYearSeleccionado.forEach((registro: Record) => {
        if (!tipoColores[registro.invoiceType]) {
            // Asignar un color aleatorio para cada "descRegistro"
            tipoColores[registro.invoiceType] = getRandomColor();
        }
    });

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const tipoFiltrado = filterByType === 'All' ? registrosDelYearSeleccionado : registrosDelYearSeleccionado.filter((registro) => registro.invoiceType === filterByType);

    let sumaDeValoresDelMes = 0;
    if (tipoFiltrado) {
        console.log('tipoFiltrado:');
        console.log(tipoFiltrado);
        //sumaDeValoresDelMes = tipoFiltrado.reduce((total: any, item: { subTotal: any }) => total + item.subTotal, 0);
        let sumaDeValoresDelMes: number;
        if (filterByType === "Purchase") {
            sumaDeValoresDelMes = tipoFiltrado.reduce((total: number, item: any) => total + (item.amount * item.price), 0);
        } else if (filterByType === "Sales") {
            sumaDeValoresDelMes = tipoFiltrado.reduce((total: number, item: any) => total + (item.amount * (item.price + (item.price * (item.utility / 100) || 0))), 0);
        } else {
            // Puedes agregar más casos según sea necesario
            console.error("Tipo de filtro no válido");
        }
        console.log('sumaDeValoresDelMes:' + getTopSellingProducts(tipoFiltrado, filterByType));
    }

    function sumPriceByDescription(records: Record[]): Record[] {
        const summarizedRecords: { [description: string]: Record } = {};

        records.forEach((record) => {
            const key = record.description;
            if (!summarizedRecords[key]) {
                summarizedRecords[key] = { ...record };
            } else {
                summarizedRecords[key].price += record.price;
            }
        });
        const result: Record[] = Object.values(summarizedRecords);
        return result;
    }

    function getTopSellingProducts(records: Record[], targetInvoiceType: string): Record[] {
        const filteredRecords = records.filter((record) => record.invoiceType === targetInvoiceType);

        const productSalesMap: { [productId: number]: number } = {};
        // Calcular la venta total de cada producto
        filteredRecords.forEach((record) => {
            const productSales = (() => {
                switch (targetInvoiceType) { // Cambiado de filterByType a targetInvoiceType
                    case "Purchase":
                        return record.price * record.amount;
                    case "Sales":
                        return record.amount * (record.price + (record.price * record.utility || 0));
                    default:
                        console.error("Tipo de filtro no válido");
                        return 0;
                }
            })();
            // Utilizar el productId como clave para sumar los valores
            productSalesMap[record.productId] = (productSalesMap[record.productId] || 0) + productSales;
        });

        // Crear un array de objetos con productId y totalSales
        const sortedProducts = Object.keys(productSalesMap)
            .map((productId) => ({
                productId: parseInt(productId),
                totalSales: productSalesMap[parseInt(productId)],
            }))
            .sort((a, b) => b.totalSales - a.totalSales);

        // Crear un mapa de registros únicos con la suma total
        const uniqueProductMap: { [productId: number]: Record } = {};
        filteredRecords.forEach((record) => {
            uniqueProductMap[record.productId] = uniqueProductMap[record.productId] || { ...record, totalSales: 0 };
            uniqueProductMap[record.productId].totalSales += productSalesMap[record.productId];
        });

        // Convertir el mapa a un array de registros únicos
        const topSellingProducts = Object.values(uniqueProductMap);

        return tipoFiltrado;
        //return sumPriceByDescription(topSellingProducts);
    }

    function calcularYModificar(records: Record[]): Record[] {
        const acumulador: Record[] = [];

        console.log("records:");
        console.log(records);


        // Recorrer el array de objetos
        records.forEach((record) => {
            const existingRecord = acumulador.find((r) => r.description === record.description);

            // Verificar si el producto ya está en el acumulador
            if (existingRecord) {
                // Sumar la cantidad al acumulador existente
                existingRecord.amount += record.amount;
            } else {
                // Agregar una nueva entrada al acumulador
                acumulador.push({ ...record });
            }
        });
        console.log("acumulador:");
        console.log(acumulador);

        return acumulador;
    }


    const topSellingProducts = calcularYModificar(tipoFiltrado);
    console.log('topSellingProducts:');
    console.log(topSellingProducts);

    // Crear el array de pieChartData para los productos más vendidos
    const pieChartData = topSellingProducts.map((product) => ({
        // value: product.price * product.amount,
        value: (() => {
            switch (filterByType) {
                case "Purchase":
                    return product.price * product.amount;
                case "Sales":
                    return product.amount * (product.price + (product.price * (product.utility / 100) || 0));
                default:
                    console.error("Tipo de filtro no válido");
                    return 0; // Otra opción podría ser asignar un valor predeterminado o lanzar una excepción
            }
        })(),
        label: product.description,
        fill: tipoColores[filterByType], // Puedes ajustar esto según sea necesario
    }));

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 10);
    }, []);

    //lines chart Utility
    const generateMonthlyChartData = (records: Record[]) => {
        // Verifica si no hay registros o el array está vacío
        if (!records || records.length === 0) {
            console.error("No hay registros para procesar en el gráfico");
            return { originalData: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
        }

        // Filtra los registros por tipo
        const type = "Sales";
        const filteredRecords = records.filter(record => record.invoiceType === type);

        // Verifica que haya registros después del filtro
        if (filteredRecords.length === 0) {
            console.error(`No hay registros de tipo ${type}`);
            return { originalData: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
        }

        const aggregatedData: { [key: string]: number } = {};
        //const xAxisData: { data: string[]; scaleType: 'band' }[] = [{ data: [], scaleType: 'band' as const }];

        const monthlyChartData: { month: string; utility: number }[] = [];

        filteredRecords.forEach((record) => {
            // Verifica que record tenga la propiedad 'dateIssue'
            if (record.dateIssue) {
                const date = new Date(record.dateIssue);
                const month = date.toLocaleString('en-US', { month: 'long' });

                const sales = record.price * (record.utility / 100) * record.amount;

                const existingMonth = monthlyChartData.find((item) => item.month === month);

                if (!existingMonth) {
                    // Si el mes no existe en el array, lo añadimos
                    monthlyChartData.push({ month, utility: sales });
                } else {
                    // Si el mes ya existe, actualizamos la utilidad
                    existingMonth.utility += sales;
                }
            } else {
                console.error(`Registro sin propiedad 'dateIssue': ${JSON.stringify(record)}`);
            }
        });

        console.log('monthlyChartData');
        console.log(monthlyChartData);
        // if (xAxisData[0].data.length === 0) {
        //     console.error("No hay datos para mostrar en el gráfico");
        //     return { originalData: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
        // }
        // const originalData = xAxisData[0].data.map(description => aggregatedData[description]);
        const originalData = monthlyChartData.map(entry => entry.utility);
        const xAxisData: { data: string[]; scaleType: 'band' }[] = [{ data: monthlyChartData.map(entry => entry.month), scaleType: 'band' as const }];


        return { originalData, xAxisData };
    };

    const { originalData, xAxisData } = generateMonthlyChartData(registrosDelYearSeleccionado);
    const formatData = (data: any[]) => {
        return data.map(value => `$${value.toFixed(1)}k`);
    };
    const formattedData = formatData(originalData);
    const seriesData = [{ data: originalData }];
    const isChartDataEmpty = seriesData.length === 0 || xAxisData[0].data.length === 0;
    const height = 290;
    const margin = { top: 10, bottom: 30, left: 40, right: 10 };

    //lines chart Purchase
    // const generateMonthlyChartDataPurchase = (records: Record[]) => {
    //     if (!records || records.length === 0) {
    //         console.error("No hay registros para procesar en el gráfico");
    //         return { originalDataPurchase: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
    //     }
    //     const type = "Purchase";
    //     const filteredRecords = records.filter(record => record.invoiceType === type);
    //     if (filteredRecords.length === 0) {
    //         console.error(`No hay registros de tipo ${type}`);
    //         return { originalDataPurchase: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
    //     }
    //     const monthlyChartData: { month: string; utility: number }[] = [];
    //     filteredRecords.forEach((record) => {
    //         if (record.dateIssue) {
    //             const date = new Date(record.dateIssue);
    //             const month = date.toLocaleString('en-US', { month: 'long' });
    //             const sales = record.price * record.amount;
    //             const existingMonth = monthlyChartData.find((item) => item.month === month);
    //             if (!existingMonth) {
    //                 monthlyChartData.push({ month, utility: sales });
    //             } else {
    //                 existingMonth.utility += sales;
    //             }
    //         } else {
    //             console.error(`Registro sin propiedad 'dateIssue': ${JSON.stringify(record)}`);
    //         }
    //     });
    //     console.log('monthlyChartData');
    //     console.log(monthlyChartData);
    //     // if (xAxisData[0].data.length === 0) {
    //     //     console.error("No hay datos para mostrar en el gráfico");
    //     //     return { originalData: [], xAxisData: [{ data: [], scaleType: 'band' as const }] };
    //     // }
    //     // const originalData = xAxisData[0].data.map(description => aggregatedData[description]);
    //     const originalDataPurchase = monthlyChartData.map(entry => entry.utility);
    //     const xAxisDataPurchase: { data: string[]; scaleType: 'band' }[] = [{ data: monthlyChartData.map(entry => entry.month), scaleType: 'band' as const }];


    //     return { originalDataPurchase, xAxisDataPurchase };
    // };

    // const generateMonthlyChartDataPurchase = (records: Record[]) => {
    //     if (!records || records.length === 0) {
    //         console.error("No hay registros para procesar en el gráfico");
    //         return { originalDataPurchase: [], xAxisDataPurchase: [{ data: [], scaleType: 'band' as const }] };
    //     }

    //     console.log('Purchase records');
    //     console.log(records);

    //     const type = "Purchase";
    //     const filteredRecords = records.filter(record => record.invoiceType === type);

    //     console.log('Purchase filteredRecords');
    //     console.log(filteredRecords);

    //     if (filteredRecords.length === 0) {
    //         console.error(`No hay registros de tipo ${type}`);
    //         return { originalDataPurchase: [], xAxisDataPurchase: [{ data: [], scaleType: 'band' as const }] };
    //     }

    //     const monthlyChartData: { month: string; totalSales: number }[] = [];

    //     filteredRecords.forEach((record) => {
    //         if (record.dateIssue) {

    //             console.log("c/record"+ record.invoiceID  +" "+ record.price * record.amount);
    //             const date = new Date(record.dateIssue);
    //             const month = date.toLocaleString('en-US', { month: 'long' });
    //             const sales = record.price * record.amount;
    //             const existingMonth = monthlyChartData.find((item) => item.month === month);

    //             if (!existingMonth) {
    //                 monthlyChartData.push({ month, totalSales: sales });
    //             } else {
    //                 existingMonth.totalSales += sales;
    //                 console.log("suma de invoice: "+existingMonth.totalSales);

    //             }
    //         } else {
    //             console.error(`Registro sin propiedad 'dateIssue': ${JSON.stringify(record)}`);
    //         }
    //     });

    //     console.log('Purchase monthlyChartData');
    //     console.log(monthlyChartData);

    //     const originalDataPurchase = monthlyChartData.map(entry => entry.totalSales);
    //     const xAxisDataPurchase: { data: string[]; scaleType: 'band' }[] = [
    //         { data: monthlyChartData.map(entry => entry.month), scaleType: 'band' as const }
    //     ];

    //     return { originalDataPurchase, xAxisDataPurchase };
    // };

    const generateMonthlyChartDataPurchase = (records: Record[]) => {
        if (!records || records.length === 0) {
          console.error("No hay registros para procesar en el gráfico");
          return { originalDataPurchase: [], xAxisDataPurchase: [{ data: [], scaleType: 'band' as const }] };
        }
      
        console.log('Purchase records');
        console.log(records);
      
        const type = "Purchase";
        const filteredRecords = records.filter(record => record.invoiceType === type);
      
        console.log('Purchase filteredRecords');
        console.log(filteredRecords);
      
        if (filteredRecords.length === 0) {
          console.error(`No hay registros de tipo ${type}`);
          return { originalDataPurchase: [], xAxisDataPurchase: [{ data: [], scaleType: 'band' as const }] };
        }
      
        const monthlyChartData: { month: string; totalSales: number }[] = [];
      
        filteredRecords.forEach((record) => {
          if (record.dateIssue) {
            console.log("c/record" + record.invoiceID + " " + record.price * record.amount);
            const date = new Date(record.dateIssue);
            const month = date.toLocaleString('en-US', { month: 'long' });
            const sales = record.price * record.amount;
            const existingMonth = monthlyChartData.find((item) => item.month === month);
      
            if (!existingMonth) {
              monthlyChartData.push({ month, totalSales: sales });
            } else {
              existingMonth.totalSales += sales;
              console.log("suma de invoice: " + existingMonth.totalSales);
            }
          } else {
            console.error(`Registro sin propiedad 'dateIssue': ${JSON.stringify(record)}`);
          }
        });
      
        console.log('Purchase monthlyChartData');
        console.log(monthlyChartData);
      
        // const originalDataPurchase = monthlyChartData.map(entry => String(entry.totalSales));
        const originalDataPurchase = monthlyChartData.map(entry => entry.totalSales);


        const xAxisDataPurchase: { data: string[]; scaleType: 'band' }[] = [
          { data: monthlyChartData.map(entry => entry.month), scaleType: 'band' as const }
        ];
      
        console.log(originalDataPurchase); // ["132000", "180000"]
        console.log(xAxisDataPurchase); // [{ data: ["January", "February", ...], scaleType: 'band' }]
      
        return { originalDataPurchase, xAxisDataPurchase };
      };


    const { originalDataPurchase, xAxisDataPurchase } = generateMonthlyChartDataPurchase(registrosDelYearSeleccionado);
    const formatDataPurchase = (data: any[]) => {
        return data.map(value => `$${value.toFixed(1)}k`);
    };
    const formattedDataPurchase = formatData(originalDataPurchase);
    const seriesDataPurchase = [{ data: originalDataPurchase }];
    // const isChartDataEmptyPurchase = seriesDataPurchase.length === 0 || xAxisDataPurchase[0].data.length === 0;
    const isChartDataEmptyPurchase = !xAxisDataPurchase || xAxisDataPurchase.length === 0 || xAxisDataPurchase[0].data.length === 0;
    const heightPurchase = 290;
    const marginPurchase = { top: 10, bottom: 30, left: 40, right: 10 };



    return (
        // <Container component="main" maxWidth="xs" sx={{ marginTop: 10, height: '540.5px' }}>
        <Container component="main" maxWidth="xs" className={`fade-in-vertical ${isVisible ? 'active' : ''} common-styles`}>
            <CssBaseline />
            <div style={{ textAlign: "center" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Home
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="center">
                    <ShoppingCartIcon />
                    <Switch
                        checked={filterByType === 'Purchase'}
                        onChange={(event) => setFilterByType(event.target.checked ? 'Purchase' : 'Sales')}
                        color="primary"
                        inputProps={{ 'aria-label': 'toggle type filter' }}
                    />
                    <PaidIcon />
                </Box>


                <Box display="flex" alignItems="center" justifyContent="center">
                    <IconButton onClick={handlePreviousDate}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Tabs
                        value={years.indexOf(currentYear)}
                        onChange={handleTabClick}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {allDates.map((year, index) => (
                            <Tab key={year} label={year} value={index} style={{ width: "100%" }} />
                        ))}
                    </Tabs>
                    <IconButton onClick={handleNextDate}>
                        <ArrowForwardIcon />
                    </IconButton>
                </Box>

                <Typography variant="h6">
                    Total Año: {sumaDeValoresDelMes}
                </Typography>

                <div>
                    {isChartDataEmpty ? (
                        <p>No hay datos para gráfico de Utilidades por año.</p>
                    ) : (
                        <LineChart
                            series={seriesData}
                            height={height}
                            xAxis={xAxisData}
                            margin={margin}
                        />
                    )}
                </div>
                <div>
                    {isChartDataEmptyPurchase ? (
                        <p>No hay datos para gráfico de Compras por año.</p>
                    ) : (
                        <LineChart
                            series={seriesDataPurchase}
                            height={height}
                            xAxis={xAxisDataPurchase}
                            margin={margin}
                        />
                    )}
                </div>

                <form></form>
            </div>
        </Container>
    );
};

export default Home;
