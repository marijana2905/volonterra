import SearchFilter from './SearchFilter';
import SelectCategory from './SelectCategory';
import SelectCity from './SelectCity';
import SelectDateRange from './SelectDateRange';
import SelectOrganization from './SelectOrganization';
import SelectStatus from './SelectStatus';

const ActionFilters = () => {
  return (
    <>
      <div className="hidden lg:flex">
        <SearchFilter />
      </div>
      <SelectStatus />
      <SelectCategory />
      <SelectCity />
      <SelectOrganization />
      <SelectDateRange />
    </>
  );
};

export default ActionFilters;
