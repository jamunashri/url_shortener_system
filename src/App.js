import "./index.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function App() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const handleChangeInput = (e) => {
    setInput(e.target.value);
  };
  const shorterAlgo = () => {
    if (input) {
      setIsLoading(true);
      axios
        .post(`https://api.shrtco.de/v2/shorten?url=${input}`)
        .then((res) => {
          setIsLoading(false);
          let {
            data: { result: full_short_link },
          } = res;
          setResult(full_short_link);
        })
        .catch((err) => {
          setIsLoading(false);
          let {
            response: { data: error_code },
          } = err;
          switch (error_code) {
            case 10: {
              setError(
                "The link you entered is a disallowed link, Please try diffrent link"
              );
              break;
            }
            case 2: {
              setError("Please provide the valid URL");
              break;
            }
            default: {
              setError("Unexpected error occurs..");
            }
          }
        });
    } else {
      setError("Please enter the URL");
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setError("");
      setIsCopied(false);
    }, 2000);
  }, [error, isCopied]);
  return (
    <div className="App">
      <h1>NewsBytes Hiring: Full-Stack Developer</h1>
      <h2>URL Shortener System Design</h2>
      <h4>Please provide the URL here </h4>
      <input type="text" value={input} onChange={(e) => handleChangeInput(e)} />
      <button className="btn" onClick={() => shorterAlgo()}>
        URL Shoten
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </button>
      <div>{isLoading && <p> Loading........ </p>}</div>
      <div>{error && <span className="err">{error} </span>}</div>
      <div>
        {result && (
          <h3>
            Just click the URL, it will copy to your dashboard :)
            <div>
              <CopyToClipboard text={result} onCopy={() => setIsCopied(true)}>
                <span className="res">{result}</span>
              </CopyToClipboard>
            </div>
          </h3>
        )}
      </div>
      {isCopied ? <span className="err">Copied.</span> : null}
    </div>
  );
}
