import { isOffline, saveToLocal, loadFromLocal } from "../utils/offlineUtils";
import { useState, useEffect } from "react";

export default function useOfflineData(key, fetcher, fallback = []) {
  const [data, setData] = useState(loadFromLocal(key, fallback));

  useEffect(() => {
    if (isOffline()) return; // use cached only
    fetcher().then((fresh) => {
      setData(fresh);
      saveToLocal(key, fresh);
    }).catch(() => {
      // if fetch fails, fallback to cached
      setData(loadFromLocal(key, fallback));
    });
  }, []);

  return data;
}
