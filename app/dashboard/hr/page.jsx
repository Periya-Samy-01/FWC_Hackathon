import QuickActions from '../../components/hr/QuickActions';
import ManagePayroll from '../../components/hr/ManagePayroll';
import ManageSalary from '../../components/hr/ManageSalary';
import ResumeScreener from '../../components/hr/ResumeScreener';

const HRDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <QuickActions />
      </div>

      <section className="mb-8">
        <ResumeScreener />
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        <section className="w-full lg:w-1/2">
          <ManageSalary />
        </section>
        <section className="w-full lg:w-1/2">
          <ManagePayroll />
        </section>
      </div>
    </div>
  );
};

export default HRDashboard;