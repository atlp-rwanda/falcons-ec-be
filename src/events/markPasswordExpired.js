  export const markPasswordExpired = async (expiredUsers) => {
    if (expiredUsers.length) {
      try {
        for (let i = 0; i < expiredUsers.length; i++) {
          // Update status of the User to "NeedsToUpdatePassword"
          await expiredUsers[i].update({ status: 'NeedsToUpdatePassword' });
          console.log('Update The Following Password => ' + expiredUsers[i].id);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('No expired password');
    }
  };
