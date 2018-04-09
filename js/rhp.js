 var pictureArray = ['dog','mouse','cat','frog','bug','fly','spider','bat','monkey'];
 
window.onload = function() {
   
    for (var i = 0; i < pictureArray.length; i++) {
        document.getElementById(pictureArray[i]).addEventListener('click', function (e) {
 
            if (name == e.target.id) {
                console.log("Goed");
                document.getElementById("text").innerHTML = "Gefeliciteerd, het goede plaatje!";
            } else {
                console.log("Fout");
                document.getElementById("text").innerHTML = "Oh nee, het foute plaatje!";
            }
        });
 
    }
 
};