document.addEventListener("DOMContentLoaded", async () => {
    const sharedHeader = document.getElementById("shared-header");
    try {
        const res = await fetch("/navbar.html");
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        sharedHeader.innerHTML = html;
    }
    catch(error){
        console.log("Error", error);
    }
    
});


const navbarToggle = document.querySelector("navbar-toggle");
navbarToggle.addEventListener("Click", () => {
    throw new Error("Not Implemented");
});