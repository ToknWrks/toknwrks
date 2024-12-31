"use client";

import { useState, useEffect } from "react";
import { assets } from "chain-registry";
import { AvailableItem, Box, SwapToken, SwapTokenProps } from "@interchain-ui/react";

const symbols = ["ATOM", "OSMO", "JUNO", "STARS", "BLD", "STRD", "CRO", "AKT", "MARS"];

const getDropdownList = () => {
  return symbols
    .map((symbol, index) => {
      const asset = assets.find((assetList) => assetList.assets[0].symbol === symbol)?.assets[0];

      if (!asset) return null;

      return {
        key: `${symbol}-${index}`, // Unique key for each item
        imgSrc: asset.logo_URIs?.png || asset.logo_URIs?.jpeg || asset.logo_URIs?.svg,
        name: asset.name,
        symbol: asset.symbol,
        denom: asset.base,
        available: 0, // Initialize as 0, will populate dynamically
        priceDisplayAmount: 0, // Initialize as 0, will populate dynamically
      } as AvailableItem;
    })
    .filter(Boolean); // Remove null values
};

export default function Demo() {
  const [dropdownList, setDropdownList] = useState<AvailableItem[]>([]);

  useEffect(() => {
    // Populate dynamic data after hydration
    const updatedList = getDropdownList().map((item) => ({
      ...item,
      available: Number((Math.random() * 100).toFixed(6)),
      priceDisplayAmount: Math.floor(Math.random() * 10) + 1,
    }));
    setDropdownList(updatedList);
  }, []);

  const [from, setFrom] = useState<SwapTokenProps["to"]>({
    label: "From",
    options: dropdownList ?? [],
    selected: dropdownList[0] ?? null,
    amount: 0,
    onItemSelected: (selectedItem) => {
      console.log("From: onItemSelected", selectedItem);
      setFrom((prev) => ({
        ...prev,
        selected: selectedItem,
      }));
    },
  });

  const [to, setTo] = useState<SwapTokenProps["to"]>({
    label: "To",
    options: dropdownList ?? [],
    selected: dropdownList[1] ?? null,
    amount: 0,
    onItemSelected: (selectedItem) => {
      console.log("To: onItemSelected", selectedItem);
      setTo((prev) => ({
        ...prev,
        selected: selectedItem,
      }));
    },
  });

  useEffect(() => {
    // Update `from` and `to` options after dropdown list is populated
    if (dropdownList.length > 0) {
      setFrom((prev) => ({
        ...prev,
        options: dropdownList,
        selected: dropdownList[0],
      }));
      setTo((prev) => ({
        ...prev,
        options: dropdownList,
        selected: dropdownList[1],
      }));
    }
  }, [dropdownList]);

  const onToggleDirection = () => {
    const prevTo = to;
    const prevFrom = from;

    setTo({ ...prevFrom, label: "To" });
    setFrom({ ...prevTo, label: "From" });
  };

  return (
    <div id="swap-token-story">
      <Box width="100%">
        <SwapToken
          from={from}
          to={to}
          swapPrice={{
            hasRoute: true,
            priceImpact: "< 0.001%",
            swapFee: {
              percentage: "0.2%",
              value: "< $0.01",
            },
            routeDisabled: false,
            minimumReceived: 250.4,
          }}
          onToggleDirection={onToggleDirection}
          onSwap={() => {
            console.log("Swap");
          }}
          onToleranceChange={(percent) => {
            console.log("onToleranceChange", percent);
          }}
        />
      </Box>
      <div>
        {dropdownList.map((item) => (
          <div key={item.key}>
            <img src={item.imgSrc} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
