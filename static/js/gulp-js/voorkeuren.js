const energielevel=document.getElementById("energielevel"),leefstijl=document.getElementById("leefstijl"),grootte=document.getElementById("grootte"),slaapritme=document.getElementById("slaapritme"),nextButton=document.getElementById("nextButton"),dropdowns=document.querySelectorAll("select");let allDropdownsSelected=!1;const updateButton=()=>{allDropdownsSelected=!0,dropdowns.forEach(e=>{"--"===e.value&&(allDropdownsSelected=!1)}),nextButton.style.backgroundColor=allDropdownsSelected?"#A6B1E1":""},updateText=(dropdowns.forEach(e=>{e.addEventListener("change",updateButton)}),nextButton.addEventListener("click",e=>{allDropdownsSelected||(e.preventDefault(),alert("Niet alle onderdelen zijn geselecteerd."))}),()=>{var e=document.getElementById("styleText1"),t=document.getElementById("styleText2"),n=document.getElementById("styleText3"),d=document.getElementById("styleText4");e.innerHTML="--"!==energielevel.value?"checked":"",t.innerHTML="--"!==leefstijl.value?"checked":"",n.innerHTML="--"!==grootte.value?"checked":"",d.innerHTML="--"!==slaapritme.value?"checked":""});energielevel.addEventListener("change",updateText),leefstijl.addEventListener("change",updateText),grootte.addEventListener("change",updateText),slaapritme.addEventListener("change",updateText),document.addEventListener("DOMContentLoaded",()=>{document.getElementById("enhancement").style.display="none"});