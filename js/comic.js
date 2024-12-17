var maxComic = -1;
var currentComic = -1;
let preloadedComic = null;

window.onload = function(){
    //hämta senaste comic 
    getComic("latest");
    //sätter funktionalitet för nav knappar 
    document.getElementById('first').addEventListener('click', function(){
        if(currentComic!=1){
            getComic(1);
        }
    });

    document.getElementById('prev').addEventListener('click', function(){
        if(currentComic > 1){
            getComic(currentComic - 1);
        }
    });

    document.getElementById('random').addEventListener('click', function(){
        const randomComic = Math.floor(Math.random() * maxComic) + 1;
        getComic(randomComic);
    });

    document.getElementById('next').addEventListener('click', function(){
        if(preloadedComic && preloadedComic.num === currentComic +1){
            appendComic(preloadedComic);
            preloadedComic = null;
        } else if (currentComic <maxComic) {
            getComic(currentComic + 1);
        }
        preloadNextComic();
    });

    document.getElementById('last').addEventListener('click', function(){
        if(currentComic != maxComic){
            getComic(maxComic);
        }
    });
}

function getComic(which){
    //Hämta (fetch) data från xkcd api
    fetch("https://xkcd.vercel.app/?comic="+which)
        .then(function(response){
            //Kolla om svaret är ok(200)
            if(response.status === 200){
                return response.json();
            } else {
                //Kastar ett felmeddelande om status inte är ok
                throw new Error("Failed to load comic");
            }
        })
        .then(function(data){
            //Uppdatera maxComic värde
            if(maxComic < data.num){
                maxComic = data.num;
            }
            //Skicka json data för behandling till DOM
            console.log(data);
            appendComic(data);
            preloadNextComic();
        })
        .catch(function(error){
            //Logga eventuella errors
            console.log("Error: ", error);
    })
}

function appendComic(data){
    //hämta referens till comic-div
    const comicDiv = document.getElementById('comic')

    //Rensa tidigare innehåll
    comicDiv.innerHTML = '';

    //Skapa och lägg till comic title
    const title = document.createElement('h2');
    title.textContent = data.title;
    comicDiv.appendChild(title);

    //Skapa och lägg till comic image
    const img = document.createElement('img');
    img.src = data.img;
    img.alt = data.alt;
    comicDiv.appendChild(img);
    
    //Skapa och lägg till comic alt-text som bildbeskrivning
    const altText = document.createElement('p');
    altText.textContent = data.alt;
    altText.style.fontStyle = 'italic';
    comicDiv.appendChild(altText);

    //Uppdatera currentComic
    currentComic = data.num;
}

function preloadNextComic() {
    if (currentComic < maxComic) {
        const nextComicNum = currentComic + 1;
        fetch(`https://xkcd.vercel.app/?comic=${nextComicNum}`)
            .then(response => {
                if(response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Failed to preload next comic");
                }
            })
            .then(data => {
                preloadedComic = data;
            })
            .catch(error => console.log("Preload error:", error));
    }
}