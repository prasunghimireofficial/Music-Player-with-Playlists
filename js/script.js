
let currentSong = new Audio();
let playingStatus = false;
let songs;
let artist = "Music Player";
let currentFolder;


currentSong.volume = 0.1;
// document.querySelector(".range input").value = 10;

let albumTitle;


// Local Storage
if (localStorage.getItem('folderName') === null || localStorage.getItem('folderName') === "null" || localStorage.getItem('folderName') === undefined || localStorage.getItem('folderName') === "") {
    localStorage.setItem('folderName', 'Adele/');
    // localStorage.setItem('folderName', 'Sushant%20KC/');
} else {
    albumTitle = localStorage.getItem('folderName');
}


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currentFolder = folder;

    localStorage.removeItem('folderName');
    localStorage.setItem('folderName', currentFolder.replaceAll("songs/", ""));
    albumTitle = localStorage.getItem('folderName');

    console.log("After Clicking in Cards = ", albumTitle);

    document.querySelector(".library .heading h2").innerHTML = decodeURI(currentFolder.replaceAll("songs/", "").replaceAll("/", ""))


    let a = await fetch(`${folder}`);
    let responses = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responses;

    // console.log(responses);

    let as = div.getElementsByTagName('a');

    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}`)[1]);
        }
    }


    // Show all the songs in the Playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML +
            `<li> <img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div class="title">

                    <p>${decodeURI(song).replaceAll("%20", " ").replaceAll(".mp3", "").replaceAll("(MP3_320K)", "").replaceAll("_", " ").replaceAll("1", "").replaceAll("(Official Video)", "").replaceAll("(Official Lyric Video)", "").replaceAll("(Official Lyric Video)", "").replaceAll("(Lyric Video)", "").replaceAll("%26", "&")}</p>

                    
                    <h6 class="songName">${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</h6>

                </div>
                <div class="artist">
                    ${artist}
                </div>
            </div> 
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }


    // Attach an eventListner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".songName").innerHTML.trim() + ".mp3");
            document.querySelector(".songinfo p").classList.add("marquee");
            // playMusic(e.querySelector(".songName")).style.backgroundColor= 'black';

        })

    })

    return songs;

}

// PlayMusic Function
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currentFolder}/` + track;

    if (!pause) {
        currentSong.volume = 0.1;
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo p").innerHTML = decodeURI(track).replaceAll("%20", " ").replaceAll(".mp3", "").replaceAll("(MP3_320K)", "").replaceAll("_", " ").replaceAll("1", "").replaceAll("(Official Video)", "").replaceAll("(Official Lyric Video)", "").replaceAll("(Official Lyric Video)", "").replaceAll("(Lyric Video)", "").replaceAll("%26", "&")

    document.querySelector(".current-time").innerHTML = "00:00";
    document.querySelector(".total-duration").innerHTML = "00:00";

}

//To Fetch the data of album and dislay it
async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let responses = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responses;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];



        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/").slice(-1)[0]);

            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let responses = await a.json();


            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div class="card" data-folder="${folder}">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25"
                  width="25"
                  viewBox="0 0 384 512"
                >
                  <path
                    opacity="1"
                    fill="#1E3050"
                    d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                  />
                </svg>
              </div>
              <img src="songs/${folder}/cover.png" alt="" />
              <h2>${responses.title}</h2>
              <p>${responses.description}</p>
            </div>`
        }
    }

    //Load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`);

            playMusic(songs[0]);
            document.querySelector(".songinfo p").classList.add("marquee");
        })
    })

}

async function main() {


    // Get the list of all the songs
    await getSongs(`songs/${localStorage.getItem('folderName')}`);
    console.log(localStorage.getItem('folderName'));
    playMusic(songs[0], true);


    // Display all the albums on the page
    await displayAlbums()

    // Attach an eventListner to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
            document.querySelector(".songinfo p").classList.add("marquee");
        } else {
            currentSong.pause()
            play.src = "img/play.svg";
            document.querySelector(".songinfo p").classList.remove("marquee");
        }
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index - 1) >= 0) {
            playMusic(songs[index -= 1]);
        } else {
            playMusic(songs[index = songs.length - 1]);
        }

    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause();

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index += 1]);
        } else {
            playMusic(songs[index = 0]);
        }
    });

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        console.log("Setting volume to", parseInt(e.target.value) / 100)
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
        document.querySelector(".volumePercentage").innerHTML = parseInt(currentSong.volume * 100) + "%";
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
        document.querySelector(".volumePercentage").innerHTML = parseInt(currentSong.volume * 100) + "%";

    })

    //  Volume update
    document.querySelector(".volumePercentage").innerHTML = parseInt(currentSong.volume * 100) + "%";

    // Add an event listener to seekbar
    document.querySelector(".seek_slider").addEventListener('input', (e) => {


        // Calculate the new current time based on the seek slider value
        let newCurrentTime = ((parseInt(e.target.value) / 1000000000000000) * currentSong.duration);
        console.log(newCurrentTime);

        // Update the current time of the audio player
        currentSong.currentTime = newCurrentTime;
    })

    // Listen for timeupdate event
    let seekSlider = document.querySelector('.seek_slider');
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".current-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`;

        document.querySelector(".total-duration").innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`;

        // Calculate the seek slider value based on the current time and duration
        let seekValue = currentSong.currentTime / currentSong.duration;

        // Update the seek slider value
        seekSlider.value = seekValue * 1000000000000000;

    })




    // Event listener to detect when the current track has ended
    currentSong.addEventListener('ended', () => {
        currentSong.pause();

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index += 1]);
        } else {
            playMusic(songs[index = 0]);
        }
    });


}

main();