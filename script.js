/*
1. Render songs
2.Scroll top
3.play/pause/seek (tua)
4.Cd rotate
5.next/prev
6.random
7.Next/repeat when ended
8.Active song
9.Scroll active song into view
10. Play song when click

*/

const $ = document.querySelector.bind(document); //function querySelector
const $$ = document.querySelectorAll.bind(document); //function querySelectorAll
const nameOfCurrentSong = $("header h2");
const imageOfCurrentSong = $(".cd .cd-thumb");
const audioOfCurrentSong = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const seekInput = $("#progress");
const prev = $('.btn-prev');
const next = $('.btn-next');
const random = $('.btn-random');
const repeat = $('.btn-repeat');



// 1. Render songs

const app = {
  currentSongIndex: 0,

  //them 1 property voi value la mot function, khong phai 1 gia tri ma dung value, ve sau khong update duoc
  getCurrentSongIndex: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentSongIndex];
      }
    });
  },
  isCheckPlay: false,
  isCheckRandom: false,
  isCheckRepeat: false,
  listSongsPlayed: [],
  songs: [
    {
      name: "Chạm khẽ tim anh một chút thôi",
      singer: "Noo Phước Thịnh",
      url: "./data/Music/Song1.mp3",
      image: "./data/CD/Song1.jpg",
    },
    {
      name: "Anh không thể",
      singer: "Mono",
      url: "./data/Music/Song2.mp3",
      image: "./data/CD/Song2.jpg",
    },
    {
      name: "Tình yêu chậm trễ",
      singer: "Monstar",
      url: "./data/Music/Song3.mp3",
      image: "./data/CD/Song3.jpg",
    },
    {
      name: "Ngày mai em đi mất",
      singer: "Khải Đăng FT Đạt G",
      url: "./data/Music/Song4.mp3",
      image: "./data/CD/Song4.jpg",
    },
    {
      name: "Màu nước mắt",
      singer: "Nguyễn Trần Trung Quân",
      url: "./data/Music/Song5.mp3",
      image: "./data/CD/Song5.jpg",
    },
    {
      name: "Tự sự",
      singer: "Orange FT Thuận Nguyễn",
      url: "./data/Music/Song6.mp3",
      image: "./data/CD/Song6.jpg",
    },
    {
      name: "Ngủ một mình",
      singer: "hieuthuhai",
      url: "./data/Music/Song7.mp3",
      image: "./data/CD/Song7.jpg",
    },
    {
      name: "Những dòng tin nhắn",
      singer: "Minh Huy x Pinny",
      url: "./data/Music/Song8.mp3",
      image: "./data/CD/Song8.jpg",
    },
    {
      name: "Ai đâu hay",
      singer: "Sean x Lusofons",
      url: "./data/Music/Song9.mp3",
      image: "./data/CD/Song9.jpg",
    },
    {
      name: "Dự báo thời tiết hôm nay mưa",
      singer: "Greyd",
      url: "./data/Music/Song10.mp3",
      image: "./data/CD/Song10.jpg",
    },
    {
      name: "Chạy ngay đi",
      singer: "Sơn tùng MTP",
      url: "./data/Music/Song11.mp3",
      image: "./data/CD/Song11.jpg",
    },
    {
      name: "Chúng ta của hiện tại",
      singer: "Sơn Tùng MTP",
      url: "./data/Music/Song12.mp3",
      image: "./data/CD/Song12.jpg",
    },
  ],

  render: function () {
    seekInput.value = 0;
    const playListItem = this.songs
      .map((element,index) => {
        return `
        <div class="song" indexSong="${index}">
          <div
            class="thumb"
            style="
              background-image: url('${element.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${element.name}</h3>
            <p class="author">${element.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `;
      })
      .join("");
    $(".playlist").innerHTML = playListItem;
  },

  //2. ScrollTop
  handelScrollTop: function () {
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;

    document.onscroll = (e) => {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = (newCdWidth / cdWidth).toFixed(1);
    };
  },

  // 3.Play/pause/seek + 4.Cd rotate + 5.Next,prev + 6.random + 7.next,prev when ended + 10.Play song when click
  loadCurrentSong: function () {
    console.log(this.currentSongIndex);
    console.log(app.currentSong);
    nameOfCurrentSong.innerText = this.currentSong.name;
    imageOfCurrentSong.style.backgroundImage = `url("${this.currentSong.image}")`;
    audioOfCurrentSong.src = this.currentSong.url;  //load bai hat
  },

  handelActiveWithSongs: function () {
    const _this = this;
    const listSong = $('.playlist');
    console.log(listSong);
    const listSongActive = listSong.querySelectorAll('.song');
    const listSongNotActive = listSong.querySelectorAll('.song:not(.active)');
    console.log(listSongNotActive);
    //4.Cd rotate
      const cdRotate = imageOfCurrentSong.animate(
        [{transform: 'rotate(360deg'}],
        {
          duration: 10000,
          iterations: Infinity,
        }
      )
      cdRotate.pause();

      //5.Next,prev
      next.onclick = function() {
        if (_this.isCheckRandom) {
          _this.randomSong();
        } else {
          _this.nextSong();
        }
        seekInput.value = 0;
        audioOfCurrentSong.play();
        _this.activeSong();
        _this.scrollActiveSong();
        _this.isCheckRepeat = false;
        repeat.classList.remove('active');
      }

      prev.onclick = function() {
        if(_this.isCheckRandom) {
          _this.randomSong();
        } else {
          _this.prevSong();
        }
        seekInput.value = 0;
        audioOfCurrentSong.play();
        _this.activeSong();
        _this.scrollActiveSong();
        _this.isCheckRepeat = false;
        repeat.classList.remove('active');
      }

      //6.random song
      random.onclick = function () {
      _this.isCheckRandom = !_this.isCheckRandom;
      random.classList.toggle('active');
      }

      //7.next,prev when ended
      audioOfCurrentSong.onended = function () {
        if(_this.isCheckRepeat) {
          audioOfCurrentSong.play();
        } else {
          if (_this.isCheckRandom) {
            _this.randomSong();
          } else {
            _this.nextSong();
          }
          seekInput.value = 0;
          audioOfCurrentSong.play();
          _this.activeSong();
          _this.scrollActiveSong();
        }
      }

      //10.Play song when click
      listSongActive.forEach((song,index) => {
        song.onclick = () => {

          const indexSong = song.getAttribute('indexSong')
          if (indexSong !== _this.currentSongIndex) {
            listSongActive[_this.currentSongIndex].classList.remove('active');
            _this.currentSongIndex = indexSong;
            _this.loadCurrentSong();
            audioOfCurrentSong.play();
            seekInput.value = 0;
            console.log(listSongActive);
            _this.activeSong();
            _this.scrollActiveSong();
          }
        }
      })

      //11.repeat song
      repeat.onclick = () => {
        _this.isCheckRepeat = !_this.isCheckRepeat;
      repeat.classList.toggle('active');
      console.log(_this.isCheckRepeat);
      }



    playBtn.onclick = function (e) {
      if (_this.isCheckPlay) {
        audioOfCurrentSong.pause();
      } else {
        audioOfCurrentSong.play();
      }
    };
    audioOfCurrentSong.onplay = function () {
      _this.isCheckPlay = true;
      player.classList.add("playing");
      cdRotate.play();
    };
    audioOfCurrentSong.onpause = function () {
      _this.isCheckPlay = false;
      player.classList.remove("playing");
      cdRotate.pause();
    };

    audioOfCurrentSong.ontimeupdate = function () {
      const duration = audioOfCurrentSong.duration;
      if (duration) {
        const currentTimeSong = audioOfCurrentSong.currentTime;
        const seekPercent = (currentTimeSong / duration) * 100;
        seekInput.value = seekPercent;
      }
    };

    seekInput.onchange = function () {
      const inputTime = seekInput.value;
      const seekSeconds = (audioOfCurrentSong.duration / 100) * inputTime;
      audioOfCurrentSong.currentTime = seekSeconds;
    };
  },

  nextSong: function () {
    const itemPlaylist = $$('.playlist .song');
    const activeSong = this.currentSongIndex;
    itemPlaylist[activeSong].classList.remove('active');
    this.currentSongIndex++;
    if (this.currentSongIndex > this.songs.length - 1) {
        this.currentSongIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    const itemPlaylist = $$('.playlist .song');
    const activeSong = this.currentSongIndex;
    itemPlaylist[activeSong].classList.remove('active');
    this.currentSongIndex--;
    if (this.currentSongIndex < 0) {
        this.currentSongIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong: function () {
    const itemPlaylist = $$('.playlist .song');
    const activeSong = this.currentSongIndex;
    itemPlaylist[activeSong].classList.remove('active');
    this.listSongsPlayed.push(this.currentSongIndex);
    if (this.listSongsPlayed.length === this.songs.length) {
        this.listSongsPlayed.splice(0,this.listSongsPlayed.length);
        this.listSongsPlayed.push(this.currentSongIndex);
    }
    let randomIndexSong = 0;
    do {
      randomIndexSong = Math.floor(Math.random() * this.songs.length);
    }
    while (this.listSongsPlayed.includes(randomIndexSong));
    
    this.currentSongIndex = randomIndexSong;
    this.loadCurrentSong();
  },

  activeSong: function () {
    const itemPlaylist = $$('.playlist .song');
    const activeSongItem = itemPlaylist[this.currentSongIndex];
    console.log(activeSongItem);
    activeSongItem.classList.add('active');
  },

  scrollActiveSong: function () {
    const arrayNoScroll = [];
    const activeSong = $('.song.active .body h3');
    console.log(activeSong);
    const activeSongName = activeSong.innerText;
   for (let i = 0; i < 2; i++) {
    arrayNoScroll.push(this.songs[i].name);
   }

   console.log(activeSongName);
   if (!arrayNoScroll.includes(activeSongName)) {
     setTimeout(() => {
      activeSong.scrollIntoView({
        behavior: 'smooth',
        block:'center',
        inline: 'nearest',
      });
     },300);
   }
  },

  // updateSongActive: function () {
  //   const listSong = $('.playlist');
  //   const listSongNotActive = listSong.querySelectorAll('.song:not(.active)');

  // },

  

  start: function () {
    this.render();
    this.activeSong();
    this.getCurrentSongIndex();
    this.loadCurrentSong();
    this.handelActiveWithSongs();
    this.handelScrollTop();
    this.scrollActiveSong();
  },
};

app.start();

//chay tu dau den cuoi (chay cac bien -> app.start)
