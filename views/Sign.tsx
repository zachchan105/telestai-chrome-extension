import React from "react";
declare var chrome: any;

import useBalance from "../useBalance";
import Balance from "../components/Balance";
import Spacer from "../components/Spacer";
import ROUTES from "../routes";
import * as cryptoStuff from "../utils/cryptoStuff";
import isValidWIF from "../utils/isValidWIF";

export function Sign({ setRoute, wif, setWIF }) {
  let address = null;

  if (isValidWIF(wif) === true) {
    address = cryptoStuff.getAddress(wif);
  } else {
    alert("Something seems wrong with your WIF");
    setRoute(ROUTES.SET_WIF);
  }

  const [addresses] = React.useState([]);
  const [message, setMessage] = React.useState("");

  if (!wif) {
    setRoute(ROUTES.SET_WIF);
    return (
      <div>
        <h3> No address set</h3>
      </div>
    );
  }
  if (address && addresses.length === 0) {
    addresses.push(address);
  }

  const balance = useBalance(addresses);

  console.log("Fetched balance:", balance);

  const signature = cryptoStuff.signMessage(wif, message).toString("base64");

  function copyAddress() {
    const promise = navigator.clipboard.writeText(address + "");

    promise.then((data) => {});

    promise.catch((e) => {
      console.log(e);
      alert("Oops error, could not copy address");
    });
  }

  function copySignature() {
    const promise = navigator.clipboard.writeText(signature);

    promise.then((data) => {});

    promise.catch((e) => {
      console.log(e);
      alert("Oops error, could not copy signature");
    });
  }

  return (
    <div>
      <div className="mb-6">
        <div className="sign--container">
          <label className="sign--adddress-label">
            Address{" "}
            <button className="button--no-style" onClick={copyAddress}>
              <i className="fa fa-copy"></i>
            </button>
          </label>
          <Spacer small />
          <small>{address}</small>
        </div>
      </div>
      <Spacer />
      <Spacer />

      {/* MESSAGE */}
      <div className="message--container">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Message to sign
        </label>
        <Spacer small />
        <textarea
          className="message--textarea"
          onChange={(event) => {
            const m = event.target.value;
            setMessage(m);
          }}
          id="message"
          rows={2}
          value={message}
        ></textarea>
      </div>
      <Spacer />
      <Spacer />
      {/* SIGNATURE */}
      <div className="signature--container">
        <label>Signature</label>{" "}
        <button className="button--no-style" onClick={copySignature}>
          <i className="fa fa-copy"></i>
        </button>
        <Spacer small />
        <textarea
          disabled
          value={signature}
          id="signature"
          className="signature__textarea"
          rows={4}
        ></textarea>
      </div>
      <Spacer />
      <Balance balanceObject={balance} />
    </div>
  );
}
