const fs = require('fs');

class SimpleDB{
    inMemoryDatabase = [];
    constructor(afilename){
        this.filename = afilename;
        this.reloadDB();
    }

    Create(username, email, password){
        if(!this.validateEmail(email)){
            throw new Error("Invalid email!");
        }
        if(!this.validatePassword(password)){
            throw new Error("Password must have at least 3 digits. At least one lowercase. At least one uppercase");
        }

        if(this.Read(email)) {
            throw new Error('User with email: ' + email +" already exists.");
        }; 
        console.log('create')
        let user = {loginUsername : username, loginEmail : email, loginPassword: password};
        console.log(this.inMemoryDatabase)
        this.inMemoryDatabase.push(user);
        return true;
    };

    Read(email){
        console.log("read")
        return this.inMemoryDatabase.find(user => user.loginEmail === email)
    };

    Update(email, newRecordData){
        let userToUpdate = this.Read(email);
        if(userToUpdate === undefined){
            return false;
        }else{
            let i = this.inMemoryDatabase.findIndex((user) => user.loginEmail === email )
            userToUpdate = newRecordData;
            this.inMemoryDatabase[i] = userToUpdate;
            console.log("User was updated!")
            return true;
        }
    };

    Delete(email){
        let userToDelete = this.Read(email);
        console.log(userToDelete)
        if(!userToDelete){
            return false;
        }else{
            let i = this.inMemoryDatabase.findIndex((user) => user.loginEmail === email )
            this.inMemoryDatabase[i] = {};
            console.log("User was deleted!")
            return true;
        }
    };

    //get data from the DB file 
    reloadDB() {
        if(fs.existsSync(this.filename)){
            const data = fs.readFileSync(this.filename, 'utf8');
            this.inMemoryDatabase = data ? JSON.parse(data) : [];
        }
    }
    
    //save data what is memory to the DB file
    flushDB() {
        fs.writeFile(this.filename, JSON.stringify(this.inMemoryDatabase) ,(err) => {
            if (err) throw err;
            console.log('Users saved to disk!');
        })
    }


    validateEmail(email){
        let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        let valid = email.match(pattern);
        console.log(email)
        return valid;
    }

    validatePassword(password){
        //Password must have at least 3 digits. At least one lowercase. At least one uppercase
        let pattern = /(?=(.*[\d]){3,})(?=.*?[a-z]){1,}(?=(.*[A-Z]){1,})/;
        let valid = password.match(pattern);
        return valid;
    }
}

let db = new SimpleDB('./users.json');
// db.Create('Viki1', 'viki@gmail.com', "12345");
// db.Create('admin', 'admin@gmail.com', "secret");

// db.Update('viki@gmail.com', {loginUsername:'Viki', loginEmail: 'viki@gmail.com', password: "123456"});
// db.Delete('viki@gmail.com');

// db.flushDB();

module.exports = db;