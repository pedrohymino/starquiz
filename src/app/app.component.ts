import { Component, OnInit } from '@angular/core';

//=== Services
import { GlobalService } from './services/global/global.service';
import { CharsService } from './services/chars/chars.service';

//=== Plugins


declare var $ :any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  page; // intro - game - result
  viewiitens = 12;
  qtditens = 0;
  aux1;aux2;
  chars=[];
  loading=false;
  modalinfo:any={};
  totalpontos = 0;

  audiovol = 1.0;
  audiomute=false;

  ranking:any = {};
  listranking:any;

  timersafe = true;// faltando 15s o timer fica vermelho
  visortimer:any = "2:00";

  constructor(
    private _global: GlobalService,
    private _chars: CharsService,
  ) { 
    if(localStorage.getItem('ranking') == null){
      localStorage.setItem('ranking',null);
    }
    setTimeout(() => {
      this._global.starbackground();
    }, 500);// delay para iniciar a animação do background, é necessário para renderizar o elemento e depois conseguir achar o elemento na tela...
    this.carregaitens(1,this.viewiitens);
    this.startIntro();

  }


  goto(page){
    // intro - game - result
    this.page = page;
  }

  startIntro(){
    this.goto('intro');
    if(localStorage.getItem('ranking') == 'null'){
      this.listranking = [];
    }else{
      let storage = JSON.parse(localStorage.getItem('ranking'));
      // ordenar os de maiores pontuacoes para os menores
      storage.sort(function(a, b){
        var keyA = new Date(a.pontos),
            keyB = new Date(b.pontos);
        // Compare the 2 dates
        if(keyA < keyB) return 1;
        if(keyA > keyB) return -1;
        return 0;
      });
      this.listranking = storage;
    }
  }

  startTimer() {
    let timer2 = this.visortimer;
    let interval = setInterval(() => {
      let timer = timer2.split(':');
      //by parsing integer, I avoid all extra string processing
      let minutes:any = parseInt(timer[0], 10);
      let seconds:any = parseInt(timer[1], 10);
      --seconds;
      minutes = (seconds < 0) ? --minutes : minutes;
      if (minutes < 0) clearInterval(interval);
      seconds = (seconds < 0) ? 59 : seconds;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      //minutes = (minutes < 10) ?  minutes : minutes;
      timer2 = minutes + ':' + seconds;
      this.visortimer = minutes + ':' + seconds;
      if(timer2 == "0:15"){this.timersafe = false;}
      if(timer2 == "0:00"){
        clearInterval(interval);
        this.stopgame();
      }
    }, 1000);
  }
  
  stopgame(){
    this.goto("result");
    for(let i=0; i<this.chars.length; i++){
      if(this.chars[i].status < 1){
        this.chars.splice(i,1);
        i--;
      }
    }
  }


  startgame(){
    this.goto("game");
    this.startTimer();
    this.clearmodalinfo();//inicializa e limpa o obj
  }

  carregaitens(de, ate) {
    for(let i=de; i<=ate; i++){
      if(i<=88){// 88 é o maximo que existe de dados na api
        if(i==17){i=18;ate++;this.qtditens++;} //id 17 nao existe, entao ira buscar mais 1 na api
        this.callchars(i).then();
        this.qtditens++;
      }
    }
    if(this.loading){setTimeout(() => {this.loading = !this.loading;}, 500);}
  }

  callchars(id){
    let resp_name;
    return new Promise((resolve, reject) => {
      this._chars.getChars(id).then((res:any) => {
        resp_name = res.name;
        this._chars.getPhoto(id).then((photo:any) => {
          this.chars.push({id:photo.id,name:resp_name,img:photo.image,pontos:10,status:0});
          resolve(true);
        });
      })
    });
  }


  loadmore(){
    if(this.qtditens<=88){
      this.loading = !this.loading;
      this.carregaitens(this.qtditens+1, this.qtditens+this.viewiitens);
    }
  }


  showinfo(char,index){
    this.modalinfo.photo = char.img;
    this.chars[index].pontos = 5;
    $('#wait').modal({
      keyboard: false,
      show: true,
      backdrop: 'static'
    });

    return new Promise((resolve, reject) => {
      this._chars.getChars(char.id).then((res:any) => {
        this._chars.getSpecies(res.species).then((species:any) => {
          this.modalinfo.species = species.name;
        });
        this.modalinfo.height = res.height;
        this.modalinfo.hair_color = res.hair_color;
        
        // get api films
        if(res.films.length>0){
          this._chars.getFilms(res.films).then((film:any)=>{
            this.modalinfo.films = film;
          });
        }else{this.modalinfo.films=["Não está presente em nenhum filme!"];}

        // get api vehicles
        if(res.vehicles.length>0){
          this._chars.getVehicles(res.vehicles).then((vehicles:any)=>{
            this.modalinfo.vehicles= vehicles;
          });
        }else{this.modalinfo.vehicles=["Não possui veículo!"];}
        
        if(res.homeworld.length>0){
          this._chars.getPlanet(res.homeworld).then((planet:any) => {
            this.modalinfo.planet = planet.name;
          });
        }else{this.modalinfo.planet = "Não possui planeta!";}

        $('#wait').modal("hide");
        $('#modalinfo').modal({
          keyboard: false,
          show: true,
          backdrop: 'static'
        });
        resolve(true);

      })
    });
  }

  clearmodalinfo(){
    this.modalinfo={
      photo:'Carregando...',
      species:'Carregando...',
      height:'Carregando...',
      hair_color:'Carregando...',
      films: ['Carregando...'],
      planet:'Carregando...',
      vehicles:['Carregando...']
    };
  }

  checkquestion(char,i,event){
    let val = event.target.value;
    if(val.toLowerCase() == char.name.toLowerCase()){
      this.totalpontos += char.pontos;
      this.chars[i].status = 1;
    }else{
      this.chars[i].status = -1;
    }
    
  }



  openregister(){
    $('#register').modal({
      keyboard: false,
      show: true,
      backdrop: 'static'
    });
  }
  savescore(dados){
    dados.pontos = this.totalpontos;
    // localStorage.setItem('ranking',this.ranking);
    if(localStorage.getItem('ranking') == 'null'){
      localStorage.setItem('ranking','['+JSON.stringify(dados)+']');
    }else{
      let array = JSON.parse(localStorage.getItem('ranking'));
      array.push(dados);
      localStorage.setItem('ranking',JSON.stringify(array));
    }
    $('#register').modal('hide');
    //reset model ranking
    this.ranking={};
    this.startIntro();
  }




  // VOLS
  toggleMute(){
    let player = <HTMLVideoElement> document.getElementById('background_audio');
    player.muted = !player.muted;
    this.audiomute = player.muted;
  }
  volup(){
    let player = <HTMLVideoElement> document.getElementById('background_audio');
    if(this.audiovol <1.0){
      this.audiovol+=0.1;
    }
    player.volume = this.audiovol;
  }
  voldown(){
    let player = <HTMLVideoElement> document.getElementById('background_audio');
    if(this.audiovol > 0.1){
      this.audiovol-=0.1;
    }
    player.volume = this.audiovol;
  }

  aboutgame(){
    $('#aboutgame').modal({
      keyboard: false,
      show: true,
      backdrop: 'static'
    });
  }




}

