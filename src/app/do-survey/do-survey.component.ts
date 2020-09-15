import { Component, OnInit, ViewChild } from '@angular/core';
// import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField} from '@angular/material/form-field';
import { RestApiService } from '../rest-api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface TableElement {
  name: string;
  gender: string;
  age: string;
  email: string;
  address: string;
  phone: string;
  job: string;
  actions: string;
}

@Component({
  selector: 'app-do-survey',
  templateUrl: './do-survey.component.html',
  styleUrls: ['./do-survey.component.scss']
})
// export class DoSurveyComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
export class DoSurveyComponent implements OnInit {
  profileForm = new FormGroup({
    name: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    job: new FormControl(''),
  });
  // User: any;
  user = {}
  keyJson = ''
  arrayData = []
  Data: TableElement[]; 
  col: string[] = ['name', 'gender', 'age', 'email', 'address', 'phone', 'job', 'delete'];
  dataSource = new MatTableDataSource<TableElement>(this.Data);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private restApiService: RestApiService) {
    // this.restApiService.getUsers().subscribe((res) => {
    //   this.dataSource = new MatTableDataSource<TableElement>(res);
    //   setTimeout(() => {
    //     this.dataSource.paginator = this.paginator;
    //     console.log(' this.paginator:'+ this.paginator)
    //   }, 0);
    // })

    // this.restApiService.getJSON().subscribe((res) => {
    //   this.dataSource = new MatTableDataSource<TableElement>(res);
    //   setTimeout(() => {
    //     this.dataSource.paginator = this.paginator;
    //     console.log(' this.paginator:'+ this.paginator)
    //   }, 0);
    // })
  }


  ngOnInit(): void {
    // caches.has('json-cache').then(function(boolean) {
    //   // true: your cache exists!
    //   caches.match('/data.json').then(function(response) {
    //     return response.json()
    //   }).then(function(response) {
    //     console.log('Lay thong tin ra:')
    //     console.log(response)
    //   });
    // });
    // console.log(this.random(10))
    // this.restApiService.takeJSON().subscribe((res) => {
    //   console.log(res)
    //   const jsonResponse = new Response(JSON.stringify(res), {
    //     headers: {
    //       'content-type': 'application/json'
    //     }
    //   });
    //   caches.open('json-cache').then(
    //     cache => {
    //       cache.put('/data.json', jsonResponse)
    //       // cache.put(this.keyJson, jsonResponse)
    //       // cache.matchAll
    //     }
    //   ).catch((err) => {
    //     console.log(err)
    //   })
    // })
    
    this.loadDataFromCache()
  }
  loadDataFromCache(){
    window.caches.has('json-cache').then((hasCache) =>{
      if (!hasCache) {
        console.log("No cahche")
      } else {
        window.caches.open('json-cache').then((cache) =>{
          const response = caches.match("/data.json").then((response) => {
            return response.json()
          }).then((response) => {
            console.log('Lay thong tin ra:')
            console.log(response[1])
            this.arrayData = response
            this.dataSource = new MatTableDataSource<TableElement>(response);
            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
              console.log(' this.paginator:'+ this.paginator)
            }, 0);
          })
        });
      }
    }).catch(function() {
      // Handle exception here.
    });

  }

  addData() {
    // console.warn(this.profileForm.value);
    let newArray = this.arrayData
    console.log(this.arrayData)
    newArray.push(this.profileForm.value)
    this.arrayData = newArray
    const jsonResponse = new Response(JSON.stringify(newArray), {
      headers: {
        'content-type': 'application/json'
      }
    });
    // OPEN
    window.caches.open('json-cache').then(
      cache => {
        // this.keyJson = this.random(10)
        cache.put('/data.json', jsonResponse)
        this.dataSource = new MatTableDataSource<TableElement>(newArray);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          console.log(' this.paginator:'+ this.paginator)
        }, 0);
      }
    ).catch((err) => {
      console.log(err)
    })
    alert("Lưu thành công")
  }
  showData() {
    const response = window.caches.match("/data.json").then((response) => {
      return response.json()
    }).then((response) => {
      console.log('Lay thong tin ra:')
      console.log(response)
      this.profileForm.patchValue(response)
    })
    // this.profileForm.patchValue({
    //   address: "19 song nhue",
    //   age: "28",
    //   email: "mhaik36@gmail.com",
    //   gender: "",
    //   job: "it",
    //   name: "Trịnh Minh Hải",
    //   phoneNumber: "0963861063"
    // })

    // caches.open('json-cache').then(function(cache) {
    //   cache.keys().then(function(keys) {
    //     console.log('ok')
    //     keys.forEach(function(request, index, array) {
    //       cache.delete(request);
    //     });
    //   });
    // })

    this.restApiService.loadJSON().subscribe((res) => {
      this.dataSource = new MatTableDataSource<TableElement>(res);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        console.log(' this.paginator:'+ this.paginator)
      }, 0);
    })
  }

  //UPDATE
  update_disabled = false
  updateData(i){
    this.profileForm.patchValue(this.arrayData[i])
    this.profileForm.get('addData').disable
  }

  //DELETE
  deleteData(i){
    // delete this.arrayData[i]
    this.arrayData = this.arrayData.slice(0, i).concat(this.arrayData.slice(i + 1, this.arrayData.length))
    const newArray = this.arrayData
    const jsonResponse = new Response(JSON.stringify(newArray), {
      headers: {
        'content-type': 'application/json'
      }
    });
    // OPEN
    caches.open('json-cache').then(
      cache => {
        // this.keyJson = this.random(10)
        cache.put('/data.json', jsonResponse)
        this.dataSource = new MatTableDataSource<TableElement>(newArray);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
      }
    ).catch((err) => {
      console.log(err)
    })
    // this.arrayData = items.slice(0, i).concat(items.slice(i + 1, items.length))
    console.log(this.arrayData)
  }
  // DELETE ALL
  deleteDataAll(){  
     caches.delete('json-cache').then( (boolean) => { 
       this.profileForm.patchValue({
          address: "",
          age: "",
          email: "",
          gender: "",
          job: "",
          name: "",
          phoneNumber: ""
       })
      });
  }

  random(length) {
    let radom13chars = function () {
      return Math.random().toString(16).substring(2, 15)
    }
    let loops = Math.ceil(length / 13)
    return new Array(loops).fill(radom13chars).reduce((string, func) => {
      return string + func()
    }, '').substring(0, length)
  }
  
}
