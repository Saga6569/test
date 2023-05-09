import * as _ from 'lodash';
import './style.css';
import dataRequest from './request';
import { dragStart, dragMove, dragEnter, dragLeave, dragEnd } from './drag'
import { mouseDown, mouseMove, mouseUp } from './resize'

interface Identifier {
  [key: string]: string;
}

interface Istate {
  requestStatus: 'progress' | 'successfully' | 'ERROR' | '';
  arrData: Identifier[];
  arrDataKeys: string[]
  darag: any;
  move: boolean;
  style: any;
};

const svg = (text: string) => `${text}<svg class='siz' width="20" height="20">
               <polygon points="20,20 20,0 0,20"
              fill = "violet" stroke = "purple" stroke - width="2"
              />
            </svg>
            `;

const state: Istate = {
  requestStatus: '',
  arrData: [],
  arrDataKeys: [],
  darag: {},
  move: false,
  style: {},
};

const reorder = (id: string, state: Istate) => { // изменения порядка

  const arrId: string[] = state.arrData.map((el) => el.id);
  const i = arrId.indexOf(id) // до какого индекса нужно переместить

  const iterate = (collection: string[], id: string): any => {
    const indexEl = collection.indexOf((id));
    if (collection[i] === id) {
      return collection;;
    }
    if (indexEl < i) {
      const value1 = collection[indexEl + 1];
      const value2 = collection[indexEl];
      collection[indexEl] = value1;
      collection[indexEl + 1] = value2;
      return iterate(collection, state.darag);
    };
    if (indexEl > i) {
      const value1 = collection[indexEl - 1];
      const value2 = collection[indexEl];
      collection[indexEl] = value1;
      collection[indexEl - 1] = value2;
      return iterate(collection, state.darag);
    };
    return collection;
  };
  const newArrId = iterate(arrId, state.darag);
  const newArrEl = newArrId.map((id: string) => {
    const newEl = state.arrData.filter((el) => el.id === id)[0];
    return newEl;
  });
  return newArrEl;
};



const buttondDownload: HTMLElement = document.querySelector('.download');
const buttondReset: HTMLElement = document.querySelector('.reset');
const plug: HTMLElement = document.querySelector('.plug');

const defaltWidthCell = 100;
const defaltHeightCell = 50;

const render = (state: Istate, drag = true) => {

  console.log(state)

  const container: HTMLElement = document.querySelector('.container')
  document.querySelector('.table')?.remove();
  if (state.arrData.length === 0) {
    plug.style.display = '';
    container.style.display = 'none';
    return;
  };

  const table: HTMLElement = document.createElement('div');
  table.className = 'table';

  container.style.display = '';
  const arrData = state.arrData;
  const keys = state.arrDataKeys;

  const trHeder = document.createElement('tr');
  // trHeder.style.width = `${defaltWidthCell}px`

  keys.forEach((key: string, i: number) => {
    const th = document.createElement('th')
    const className = `cell_${i}`
    th.className = className


    if (!(state.style).hasOwnProperty(className)) {
      state.style[className] = { width: defaltWidthCell, Height: defaltHeightCell }
    }

    const width = state.style[className].width
    const height = state.style[className].height

    th.style.width = `${width}px`;
    th.style.height = `${height}px`;
    th.innerHTML = svg(key);

    trHeder.append(th);
  });

  table.append(trHeder);

  arrData.forEach((el: Identifier, i: number) => {
    const trLine = document.createElement('tr');
    const className = `line_${i}`;
    trLine.className = className;

    if (!(state.style).hasOwnProperty(className)) {
      state.style[className] = { height: defaltHeightCell }
    }
    trLine.style.height = `${state.style[className].height}px`;

    trLine.setAttribute('draggable', 'true');
    keys.forEach((key: string, i: number) => {
      if (key === 'id') {
        trLine.id = el[key];
      };
      const td = document.createElement('td');
      td.className = `cell_${i}`
      td.innerText = el[key];
      if (i === 0) {
        td.innerHTML = svg(el[key]);
      };
      trLine.append(td);
    });
    trLine.addEventListener('dragstart', (e) => dragStart(e, state))
    trLine.addEventListener('drag', (e) => dragMove(e, state))
    trLine.addEventListener('dragenter', (e) => dragEnter(e, state, reorder))
    trLine.addEventListener('dragleave', (e) => dragLeave(e, state))
    trLine.addEventListener('dragend', (e) => dragEnd(e, state, render))
    table.append(trLine);
  });

  const addData = document.createElement('button')
  addData.innerText = 'add';

  addData.addEventListener('click', async (e) => {
    buttondDownload.setAttribute('disabled', 'true');
    await dataRequest(state);
    if (state.requestStatus === 'ERROR') {
      return;
    };
    render(state);
  });

  table.append(addData)

  container.style.opacity = '1';
  container.style.transition = '2s';
  buttondReset.style.display = '';
  plug.style.display = 'none';

  document.querySelector('.container').prepend(table);

  Array.from(document.querySelectorAll('polygon')).forEach((el: any) => {
    el.addEventListener('mousedown', (e: any) => mouseDown(e, state))
    el.addEventListener('mousemove', (e: any) => mouseMove(e, state))
    el.addEventListener('mouseup', (e: any) => mouseUp(e, state, render))
  })
};

const onClick = async () => {
  buttondDownload.setAttribute('disabled', 'true');
  if (state.arrData.length === 0) {
    await dataRequest(state);
    if (state.requestStatus === 'ERROR') {
      return;
    };
  };

  render(state);
};

const onClickRes = async () => {

  localStorage.setItem("state", null);
  state.arrData = [];
  state.arrDataKeys = [];
  buttondDownload.removeAttribute('disabled');
  state.style = {}
  render(state, false);
};

const app = async () => {
  buttondDownload.addEventListener('click', onClick);
  buttondReset.addEventListener('click', onClickRes);

  const localStorageState: Istate = JSON.parse(localStorage.getItem('state'));

  if (localStorageState !== null) {
    const keys: string[] = Object.keys(localStorageState);

    for (const key of keys as (keyof Istate)[]) {
      state[key] = localStorageState[key];
    };
    buttondDownload.setAttribute('disabled', 'true');
  };

  render(state);
};

app();
