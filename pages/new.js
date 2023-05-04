import axios from "axios";
import { PanelForm } from "components/PanelForm";
import { Layout } from "components/Layout";

function NewPage() {
  return (
    <Layout>
      <div className="h-5/6 grid place-items-center">
        <PanelForm />
      </div>
    </Layout>
  );
}
export default NewPage;

export const getServerSideProps = async (context) => {
  const res = await axios.get("http://localhost:3000/api/products");

  return {
    props: {
      products: res.data,
    },
  };
};
