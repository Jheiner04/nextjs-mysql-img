import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

function Home() {
  const [credentials, setCredentials] = useState({
    user: "victor",
    password: "12345678",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/auth/login", credentials);
    // console.log(res);

    if (res.status === 200) {
      router.push("/panel");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="usuario"
          onChange={(e) =>
            setCredentials({
              ...credentials,
              user: e.target.value,
            })
          }
        />
        <input
          type="password"
          placeholder="clave"
          onChange={(e) =>
            setCredentials({
              ...credentials,
              password: e.target.value,
            })
          }
        />
        <button>Save</button>
      </form>
    </div>
  );
}

export default Home;