

export const deactivateUser = (type, id, setEntities) => {
    console.log(type, id);

    // תרגום type לערך מתאים לשרת
    const apiType = type === "customers" ? "customer" : "provider";

    // שלב 1: בדיקת הזמנות פתוחות
    fetch(`${process.env.REACT_APP_API_URL}/users/${apiType}/${id}/open`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error checking open orders: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.openOrders > 0) {
                // יש הזמנות פתוחות
                alert(
                    `ל${type === "customers" ? "לקוח" : "ספק"} הזה יש הזמנות פתוחות. אין אפשרות למחוק אותו עד שלא יושלמו כל ההזמנות.`
                );
            } else {
                // אין הזמנות פתוחות - אישור פעולה מול המשתמש
                const confirmDeactivate = window.confirm(
                    `האם אתה בטוח שברצונך להפוך את ה${type === "customers" ? "לקוח" : "ספק"} הזה ללא פעיל?`
                );

                if (confirmDeactivate) {
                    // שלב 2: עדכון הלקוח ל"לא פעיל"
                    return fetch(`${process.env.REACT_APP_API_URL}/users/${apiType}/${id}/deactivate`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                }
            }
        })
        .then((response) => {
            if (response && !response.ok) {
                throw new Error(`Failed to deactivate ${type}: ${response.statusText}`);
            }
            return response ? response.json() : null;
        })
        .then(() => {
            // עדכון הרשימה בצד הלקוח (מחיקה של הלקוח מהרשימה)
            setEntities((prevEntities) => prevEntities.filter((entity) => entity.id !== id));
            alert(`ה${type === "customers" ? "לקוח" : "ספק"} הועבר למצב "לא פעיל" בהצלחה.`);
        })
        .catch((error) => {
            console.error(`Error deactivating ${type}:`, error.message);
            alert(`שגיאה בעת ניסיון להפוך את ה${type === "customers" ? "לקוח" : "ספק"} ללא פעיל.`);
        });
};


  
  

  
  

  
  
  export const updateUser = (id, formData, setUsers) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };
  
  // פונקציה להוספת משתמש
  export const addUser = (formData, setUsers) => {
    fetch(`${process.env.REACT_APP_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };
  