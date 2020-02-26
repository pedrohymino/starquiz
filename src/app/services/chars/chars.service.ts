import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


@Injectable()
export class CharsService {
  api = "https://swapi.co/api/people/"; // 1/
  api_photo = "https://cdn.rawgit.com/akabab/starwars-api/0.2.1/api/id/"; // 1.json
  constructor(
    private http: Http
  ) { }


  getChars(id){
    return new Promise((resolve, reject) => {
      this.http.get(this.api+id+"/").timeout(30000).map(res => res.json()).subscribe(
        (data) => {resolve(data);},
        (err) => {resolve(err);}
      );
    });
  }


  getSpecies(speciesurl){
    return new Promise((resolve, reject) => {
      this.http.get(speciesurl).timeout(30000).map(res => res.json()).subscribe(
        (data) => {resolve(data);},
        (err) => {resolve(err);}
      );
    });
  }

  getPlanet(planeturl){
    return new Promise((resolve, reject) => {
      this.http.get(planeturl).timeout(30000).map(res => res.json()).subscribe(
        (data) => {resolve(data);},
        (err) => {resolve(err);}
      );
    });
  }


  getPhoto(id){
    return new Promise((resolve, reject) => {
      this.http.get(this.api_photo+id+".json").timeout(30000).map(res => res.json()).subscribe(
        (data) => {resolve(data);},
        (err) => {resolve(err);}
      );
    });
  }




  //==================== filmes
  async getFilms(arrayfilms) {
    let arrynamefilms=[];
    let i=0;
    return await new Promise((resolve, reject) => {
      for(let value of arrayfilms){
        this.callFilms(value).then((res:any)=>{
          arrynamefilms[i] = res.title;
          i++;
          if(i==arrayfilms.length){
            resolve(arrynamefilms);
          }
        });
      }
    });
  }
  callFilms(urlfilm){
    let resp_name;
    return new Promise((resolve, reject) => {
      this.http.get(urlfilm).timeout(30000).map(res => res.json()).subscribe(
        (data) => {resolve(data);},
        (err) => {resolve(err);}
      );
    });
  }



  //==================== vehicles
  async getVehicles(arrayvehicles) {
    let arrynamevehicles=[];
    let i=0;
    return await new Promise((resolve, reject) => {
      for(let value of arrayvehicles){
        this.callVehicles(value).then((res:any)=>{
          arrynamevehicles[i] = res.name;
          i++;
          if(i==arrayvehicles.length){
            resolve(arrynamevehicles);
          }
        });
      }
    });
  }
  callVehicles(urlfilm){
    let resp_name;
    return new Promise((resolve, reject) => {
      this.http.get(urlfilm).timeout(30000).map(res => res.json()).subscribe(
        (data) => {resolve(data);},
        (err) => {resolve(err);}
      );
    });
  }



}
