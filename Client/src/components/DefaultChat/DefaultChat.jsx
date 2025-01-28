import NoChatSelectedImage from "../../../public/images/noChatSelected.png";
import styles from "./DefaultChat.module.scss";

const DefaultChat = () => {
  return (
    <div className={styles.outerWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.heading1}>
          Welcome to <span className={styles.highlightText}>Eccho</span>
        </div>
        <div className={styles.heading2}>
          Your new place to stay connected with loved ones!
        </div>
        <div className={styles.subheading1}>What are you waiting for</div>
        <div className={styles.subheading1}>Let's start Chatting!</div>
      </div>
    </div>
  );
};

export default DefaultChat;
