import { Cell } from '../state';

export const defaultCells: Cell[] = [
  {
    content:
      '# zl-jspg (Demo Version)\n### **Try [the full version](https://www.npmjs.com/package/zl-jspg) on your device to unlock more features!  Just run `npm i zl-jspg` on your terminal will work.**\n- Click any text cell (including this one) to edit it.\n- The code in each code editor is all joined together into one file. If you define a variable in cell #1, you can refer it in any following cells!\n- You can show any React component, string, number or anything else by calling `show` function. It is built into this environment. Call `show` multiple times to show multiple values.\n- Re-order or delete cells using the buttons on the top right\n- Add new cells by hovering on the divider between each cell.\n\n Below is an example of showing a simple react component ',
    type: 'text',
    id: 'jvp',
  },
  {
    content:
      "import {useState} from 'react';\n\nconst App = () => {\n  const [color, setColor] = useState('#00b4d8');\n  const simpleStyle = {color, 'font-family': 'Helvetica, sans-serif'}\n\n  const changeColorHandler = () => {\n    setColor((prevState) => (prevState === '#00b4d8' ? '#d62828' : '#00b4d8'))\n  }\n\n  return (<div>\n  <h2 style={simpleStyle}>Hello World</h2>\n  <button onClick={changeColorHandler}>Change Title Color</button>\n  </div>)\n};\n\nshow(<App/>)",
    type: 'code',
    id: 'ygr',
  },
];
