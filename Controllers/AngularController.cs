using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using System.IO;
//using System.Web;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace SpotCheck1.Controllers
{
    public class AngularController : Controller
    {
        public IActionResult Index()
        {
            ViewData["Message"] = "Your Angular2 page.";
            
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
        
        public async Task<string> PDF()
        {
            string file1 = @"C:\Users\Michael\Documents\git\SpotCheck1\TestPDFs\vdp1.pdf";
            string file2 = @"C:\Users\Michael\Documents\git\SpotCheck1\TestPDFs\vdp2.pdf";
            
            try
            {
                await PDF_AddText(file1, "Michael & Mary Tanner", false, file2);    
            }
            catch(Exception exc)
            {
                return exc.Message + "<hr>" + exc.StackTrace;
            }
            
            return "PDF 2.3";
        }
        
        
        
        
        //----------------------------------------------------------------------------------------------------
        public static async Task<byte[]> PDF_AddText(string inputFile, string text, bool isLandscape, string outputFile__LeaveNullToReturnByteArray)
        {
            //http://stackoverflow.com/questions/23722427/adding-text-to-existing-multipage-pdf-document-in-memorystream-using-itextsharp

            byte[] bytes = null;

            using (MemoryStream ms = new MemoryStream()) // in-memory PDF
            using (PdfReader reader = new PdfReader(inputFile))
            {
                //Bind a stamper to our reader
                using (PdfStamper stamper = new PdfStamper(reader, ms))
                {
                    await PDF_AddText_ViaStamper(stamper, 1, text, isLandscape);
                }
                bytes = ms.ToArray();
            }
            if (outputFile__LeaveNullToReturnByteArray != null)
            {
                System.IO.File.WriteAllBytes(outputFile__LeaveNullToReturnByteArray, bytes);
            }
                
            return bytes;
        }
        
        
        //----------------------------------------------------------------------------------------------------
        public static async Task PDF_AddText_ViaStamper(PdfStamper stamper, int pageNumb, string text, bool isLandscape)
        {
            // http://stackoverflow.com/questions/11366354/itext-whats-going-on-with-font-basefont-and-createfont
            string fontPath = (@"C:\Users\Michael\Documents\git\SpotCheck1\TestPDFs\TextaRegular.ttf");
            Font font = FontFactory.GetFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 0.8f, Font.NORMAL, BaseColor.BLACK);
            BaseFont baseFont = font.BaseFont;

            if (isLandscape)
            {
                var cb1 = stamper.GetOverContent(pageNumb); // Get the raw PDF stream "on top" of the existing content
                cb1.SetColorFill(BaseColor.WHITE);
                cb1.Rectangle(250, 496, 250, 16);
                cb1.Fill();

                var cb2 = stamper.GetOverContent(pageNumb); // for drawing text
                cb2.BeginText();
                cb2.SetFontAndSize(baseFont, 14);
                cb2.SetRGBColorFill(137, 137, 137);
                //cb2.SetColorFill(BaseColor.BLUE);
                cb2.ShowTextAligned(1, text, 383, 501, 0);
                cb2.EndText();
            }
            else
            {
                var cb1 = stamper.GetOverContent(pageNumb); // Get the raw PDF stream "on top" of the existing content
                cb1.SetColorFill(BaseColor.WHITE);
                //cb1.SetColorStroke(BaseColor.MAGENTA);
                cb1.Rectangle(11, 490, 16, 215);
                cb1.Fill();
                //cb1.Stroke();

                var cb2 = stamper.GetOverContent(pageNumb); // for drawing text
                cb2.BeginText();
                cb2.SetFontAndSize(baseFont, 14);
                cb2.SetRGBColorFill(137, 137, 137);
                //cb2.SetColorFill(BaseColor.MAGENTA);
                cb2.ShowTextAligned(1, text, 19f, 594.5f, -90);
                cb2.EndText();
            }
        }
        
        
        
        
        
        
        
        
        
    }
}
