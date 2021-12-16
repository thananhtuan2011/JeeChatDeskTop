import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CuocHopModel } from "../ChatAppModule/models/DuLieuCuocHop.model";


@Injectable({
    providedIn: "root"
  })
  export class StateService {
    state$ = new BehaviorSubject<CuocHopModel>(null);
    stateEdit$ = new BehaviorSubject<CuocHopModel>(null);
  }
