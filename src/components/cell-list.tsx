import { Fragment } from 'react';

import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <AddCell nextCellId={cell.id} />
      <CellListItem cell={cell} key={cell.id} />
    </Fragment>
  ));

  return (
    <div>
      {renderedCells}
      <div>
        <AddCell nextCellId={null} forceVisible={cells.length === 0} />
      </div>
    </div>
  );
};

export default CellList;
