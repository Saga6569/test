import * as _ from 'lodash';
import './style.css';
import dataRequest from './print';
interface Identifier {
  [key: string]: string;
}

interface Istate {
  requestStatus: 'progress' | 'successfully' | 'ERROR' | '';
  arrData: Identifier[];
  arrDataKeys: string[]
  darag: any;
};

const state: Istate = {
  requestStatus: '',
  arrData: [],
  arrDataKeys: [],
  darag: {},
}

const container: HTMLElement = document.createElement('div');
container.className = 'container';

const buttondDownload: HTMLElement = document.querySelector('.download');
const buttondReset: HTMLElement = document.querySelector('.reset');
const plug: HTMLElement = document.querySelector('.plug');

const render = (state: Istate) => {
  if (state.arrData.length === 0) {
    plug.style.display = '';
    container.style.display = 'none';
    container.querySelector('table')?.remove()
    return;
  };

  container.style.display = '';
  const arrData = state.arrData;
  const keys = state.arrDataKeys;

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  const trHeder = document.createElement('tr');
  keys.forEach((key) => {
    const th = document.createElement('th');
    th.innerText = key;
    trHeder.append(th);
  });

  table.append(tbody);
  container.append(table);
  tbody.append(trHeder);

  arrData.forEach((el: Identifier) => {
    const trLine = document.createElement('tr');
    trLine.setAttribute('draggable', 'true')
    keys.forEach((key) => {
      if (key === 'id') {
        trLine.id = el[key];
      };
      const td = document.createElement('td');
      td.innerText = el[key];
      trLine.append(td);
    });

    let clonEl: HTMLElement;

    trLine.addEventListener('dragstart', (e: any) => {
      clonEl = e.target.cloneNode(true) as HTMLElement;
      document.querySelector('tbody').append(clonEl)
      state.darag = e.target.id
      e.dataTransfer.setDragImage(new Image(), 10, 10)
      e.target.style.opacity = '0.1';
    });
    trLine.addEventListener('drag', (e: any) => {
      const el: HTMLElement = e.target;
      clonEl.style.position = 'absolute';
      clonEl.style.pointerEvents = 'none';
      if (e.pageX === 0 && e.pageY === 0) {
        return;
      };
      clonEl.style.top = `${e.pageY - 20}px`;
    })
    trLine.addEventListener('dragenter', (e: any) => {
      const idTarget = e.target.parentElement.id
      if (idTarget === state.darag) {
        return;
      };

      const node1 = document.getElementById(idTarget)
      const node2 = document.getElementById(state.darag)

      node1.parentNode.insertBefore(node2, node1);
    });

    trLine.addEventListener('dragend', (e: any) => {
      clonEl.remove();
      e.target.style.opacity = '1';
    });

    tbody.append(trLine);
  });

  container.style.opacity = '1';
  container.style.transition = '2s';
  buttondReset.style.display = '';
  plug.style.display = 'none';

  document.querySelector('body').prepend(container);
};

const onClick = async () => {
  if (state.arrData.length === 0) {
    const request = await dataRequest(state);
    if (state.requestStatus === 'ERROR') {
      return;
    };
  };
  buttondDownload.setAttribute('disabled', 'true');
  render(state);
};

const onClickRes = async () => {

  localStorage.setItem("state", JSON.stringify(null));
  state.arrData = [];
  state.arrDataKeys = [];
  buttondDownload.removeAttribute('disabled');
  render(state);
};

const app = async () => {

  document.body.prepend(container);

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
