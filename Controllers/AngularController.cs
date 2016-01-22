using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

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
    }
}
