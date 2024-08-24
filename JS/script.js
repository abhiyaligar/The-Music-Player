console.log("Let's Write JavaScript")
let currentsongs = new Audio();
let Songs;
let currFolder;

//Convert Length of Song From sec to Min And Sec

function convertSeconds(seconds) {
    // Ensure seconds is a non-negative integer
    if (seconds < 0) {
        throw new Error("Seconds must be a non-negative integer");
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds as two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}




// Get Songs From The Folder
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    Songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            Songs.push(element.href.split(`/${folder}/`)[1])

        }
    }


    // Change the Template of the defalut
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const Song of Songs) {
        songUL.innerHTML = songUL.innerHTML + `
                        <li>
                            <img class="invert image" src="/Images/music.svg" alt="">
                            <div class="info">
                                <div class="songName">${Song.replaceAll("%20", " ")}</div>
                                <div class="songArtist">Abhi</div>
                            </div>
                            <div class="btn">
                                <img class="invert" src="/Images/play.svg" alt="">
                            </div>
                        </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    });

}
//Function to Play The Music
const playMusic = (track, pause = false) => {
    currentsongs.src = `/${currFolder}/` + track
    if (!pause) {
        currentsongs.play()
        play.src = "/Images/pause.svg"
    }
    document.querySelector(".songinf").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"




}

//Fuction to Display Current Album 




// Fuction to display Album

async function displayAlbum() {
    let a = await fetch(`/Songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let cardContainer = document.querySelector(".cardcontain")
    let anchor = div.getElementsByTagName("a")
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/Songs/")) {
            let folder = e.href.split("/").slice(-2)[1]
            let a = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div class="card" data-folder="${folder}">
                    <div class="play">
                    </div>
                    <img src="/Songs/${folder}/Cover.jpg" alt="404">
                        
                    <h2>${response.title}</h2>
                </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {
            Songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            playMusic(Songs[0]);

        })
    })
}






// Main Function
async function main() {


    await getSongs("Songs/Music2")
    playMusic(Songs[0], true)


    displayAlbum();
    //Function to Play, Pause The Song
    play.addEventListener("click", () => {
        if (currentsongs.paused) {
            currentsongs.play()
            play.src = "Images/pause.svg"
        }
        else {
            currentsongs.pause()
            play.src = "Images/play.svg"
        }
    });

    
    // Listen to Time Update

    currentsongs.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSeconds(currentsongs.currentTime)} / ${convertSeconds(currentsongs.duration)}`
        document.querySelector(".circle").style.left = (currentsongs.currentTime / currentsongs.duration) * 100 + "%";
    })

    // Function to Previous Song

    pre.addEventListener("click", () => {
        currentsongs.pause()
        let index = Songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(Songs[index - 1])
        }
    })

    // Function for Hamburgur Function 

    document.querySelector(".hamburgur").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Function to Close The Left
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // Fuction to Next Song

    next.addEventListener("click", () => {
        let index = Songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
        if ((index + 1) < Songs.length - 0) {
            playMusic(Songs[index + 1])
        }
    })

    // Voulme Function

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsongs.volume = parseInt(e.target.value) / 100
    })

    //Add event listener to mute the songs
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("Images/volume.svg")) {
            e.target.src = e.target.src.replace("Images/volume.svg", "Images/mute.svg");
            currentsongs.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("Images/mute.svg", "Images/volume.svg");
            currentsongs.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


    // SeekBar Update Function
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsongs.currentTime = (currentsongs.duration) * percent / 100
    })



}

main()






