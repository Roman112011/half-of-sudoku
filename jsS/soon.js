function jusTjoke() {
    joke = Math.floor(Math.random() * 100);
    console.log(joke)
    if (joke == 19 || joke == 8 || joke == 11) {
        document.getElementById("joke").textContent = "\"No way it’s happening.\" lol you hope this happen";
        document.getElementById("joke").style.marginTop = "150px";
        document.getElementById("joke").style.color="red"
        document.getElementById("sryifjoke").style.display = "block";
        document.getElementById("sryifjoke").style.marginTop = "200px";


    }
}


document.addEventListener("DOMContentLoaded", jusTjoke);