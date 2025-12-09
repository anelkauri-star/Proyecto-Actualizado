// Backend/api/services/constanciaFactory.js
const PDFDocument = require('pdfkit');

class Constancia {
    constructor(alumno) {
        this.alumno = alumno;
    }

    async generarPDF() {
        const pdf = new PDFDocument({ margin: 50 });
        let buffers = [];

        return new Promise((resolve, reject) => {
            pdf.on("data", buffers.push.bind(buffers));
            pdf.on("end", () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            pdf.on("error", reject);

            // --- DISEÑO DEL PDF ---
            // Logo o encabezado
            pdf.fontSize(20).text("Universidad Autónoma de Aguascalientes", { align: "center" });
            pdf.fontSize(14).text("Departamento de Mercadotecnia", { align: "center" });
            pdf.moveDown(2);

            // Título
            pdf.fontSize(24).font('Helvetica-Bold').text("CONSTANCIA", { align: "center" });
            pdf.moveDown();

            // Cuerpo
            pdf.fontSize(14).font('Helvetica').text("Se otorga la presente a:", { align: "center" });
            pdf.moveDown();
            
            // Nombre del Alumno
            pdf.fontSize(20).font('Helvetica-Bold').text(this.alumno.nombre, { align: "center" });
            pdf.moveDown();

            // Texto final con el ID
            pdf.fontSize(14).font('Helvetica').text(`Con ID Institucional: ${this.alumno.id_institucional}`, { align: "center" });
            pdf.text("Por su valiosa participación en el Congreso de Mercadotecnia.", { align: "center" });
            
            pdf.moveDown(4);
            pdf.fontSize(12).text("_________________________", { align: "center" });
            pdf.text("Firma del Director", { align: "center" });

            pdf.end();
        });
    }
}

class ConstanciaFactory {
    static crearConstancia(alumno) {
        return new Constancia(alumno);
    }
}

module.exports = { ConstanciaFactory };







