import PDFDocument from "pdfkit-table";

export function buildPDF(products: any, dataCallback: any, endCallback: any) {
  const doc = new PDFDocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // doc.fontSize(25).text("Lista de Productos");

  const table = {
    title: "Lista de Productos",
    headers: [
      { label: "PRODUCTO", align: "left", headerColor: '#123', valign: "center", },
      { label: "CAPACIDAD", align: "center", valign: "center", },
      { label: "ALTURA", align: "center", headerColor: '#123', valign: "center", },
      { label: "DIAMETRO", align: "center", },
      { label: "PRECIO", align: "center", headerColor: '#123', valign: "center", },
    ],
    rows: products.map((product: any) => [
      product.name,
      product.capacity.toString(),
      product.height.toString(),
      product.diameter.toString(),
      `$${Number(product.price).toLocaleString()}`,
    ]),
  };

  const docWidth = doc.page.width;

  // Calcular el ancho total de la tabla
  const headerWidths = table.headers.map(header => 104);
  const tableWidth = headerWidths.reduce((total, width) => total + width, 0);

  // Calcular la posición x para centrar la tabla
  const tableX = (docWidth - tableWidth) / 2;

  doc.table(table, {
    width: 200,
    x: tableX,
    y: 50,
    padding: [5, 5],
    columnSpacing: 5,
    hideHeader: false,
    minRowHeight: 0,
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => doc.font("Helvetica").fontSize(10),
    columnsSize: [200, 80, 80, 80, 80],
  });

  doc.end();
}