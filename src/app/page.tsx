import Image from "next/image";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth");
  // return <div className={styles.page}></div>;
}
