import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:my_todo/db_services/database.dart';
import 'package:random_string/random_string.dart';

class Homescreen extends StatefulWidget {
  const Homescreen({super.key});

  @override
  State<Homescreen> createState() => _HomescreenState();
}

class _HomescreenState extends State<Homescreen> {

  bool personal = true, college = false, office = false;
  bool suggest = false;

  TextEditingController taskController = TextEditingController();

  Stream?todoStream;

  getontheLoad() async{
    todoStream = await DatabaseService().getTask(personal? "Personal": college? "College" : "Office");
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  Widget getWork(){
    return StreamBuilder(
      stream: todoStream,
      builder: (context, AsyncSnapshot snapshot){
        return snapshot.hasData?
        Expanded(child: ListView.builder(
          itemCount: snapshot.data.docs.length,
          itemBuilder: (context, index){
            DocumentSnapshot docSnap = snapshot.data.docs[index];

            return CheckboxListTile(
              activeColor: Colors.greenAccent.shade200,
              value: docSnap['yes'], 
              onChanged: (newValue) async{
                await DatabaseService().tickMethod(docSnap["id"], personal? "Personal": college? "College" : "Office");
                setState((){
                  Future.delayed(Duration(seconds: 2),(){
                    DatabaseService().removeMethod(docSnap["id"], personal? "Personal": college? "College" : "Office");
                  });
                  
                });
              },
            controlAffinity: ListTileControlAffinity.leading,
            title: Text(
              docSnap['work'],
            ),
            );
          }),
        ):Center(child: CircularProgressIndicator(),);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.greenAccent.shade200,
        onPressed: (){
          openBox();
        },
        child: Icon(
          Icons.add,
          color:Colors.white,
          size: 35,
        ),
      ),

      body: Container(
        padding: EdgeInsets.only(top: 60, left: 20, right: 20),
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.white,
              Colors.white54,
              Colors.white,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight
          )
        ),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              child: Text(
                "Hii",
                style: TextStyle(
                  fontSize: 30,
                  color: Colors.black
                )
              ),
            ),

            SizedBox(height: 10),

            Container(
              child: Text(
                "Ravi",
                style: TextStyle(
                  fontSize: 40,
                  color: Colors.black
                )
              ),
            ),

            SizedBox(height: 10),

            Container(
              child: Text(
                "Let's the work bigins ",
                style: TextStyle(
                  fontSize: 24,
                  color: Colors.black
                )
              ),
            ),

            SizedBox(height: 10),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                personal ? Material(
                  elevation: 5,
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.greenAccent.shade200,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      "Personal",
                      style: TextStyle(
                        fontSize: 20,
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ): GestureDetector(
                  onTap: () async{
                    personal = true;
                    college = false;
                    office = false;
                    await getontheLoad();
                    setState(() {
                    });
                  },
                  child: Text(
                    "Personal",
                    style: TextStyle(
                      fontSize: 20
                    ),
                  ),
                ),

                college ? Material(
                  elevation: 5,
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.greenAccent.shade200,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      "College",
                      style: TextStyle(
                        fontSize: 20,
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ): GestureDetector(
                  onTap: () async{
                    personal = false;
                    college = true;
                    office = false;
                    await getontheLoad();
                    setState(() {
                    });
                  },
                  child: Text(
                    "College",
                    style: TextStyle(
                      fontSize: 20
                    ),
                  ),
                ),

                office ? Material(
                  elevation: 5,
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.greenAccent.shade200,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      "Office",
                      style: TextStyle(
                        fontSize: 20,
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ): GestureDetector(
                  onTap: () async{
                    personal = false;
                    college = false;
                    office = true;
                    await getontheLoad();
                    setState(() {
                    });
                  },
                  child: Text(
                    "Office",
                    style: TextStyle(
                      fontSize: 20
                    ),
                  ),
                ),
              ],
            
            ),

            SizedBox(height: 20,),
            

            getWork(),
          ],
        )
      ),
    );
  }

  Future openBox(){
    return showDialog(
      context: context, 
      builder: (context) => AlertDialog(
        content: SingleChildScrollView(
          child: Container(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: (){
                        Navigator.pop(context);
                      },
                      child:Icon(Icons.cancel),
                    ),
          
                    SizedBox(width: 60.0,),
                    Text("add ToDo Task",
                      style: TextStyle(
                        color: Colors.greenAccent
                      ),
                    ),
                  ],
                ),
          
                SizedBox(height: 20.0,),
                Text("Add Task"),
                SizedBox(height: 10.0,),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10.0),
                  decoration: BoxDecoration(
                    border:Border.all(
                      color: Colors.black26,
                      width: 2.0,
                    )
                  ),
                  child: TextField(
                    controller: taskController,
                    decoration: InputDecoration(
                      border: InputBorder.none,
                      hintText: "Enter the task",
                    ),
                  ),
                ),

                SizedBox(height: 20.0,),
                Center(
                  child: Container(
                    width : 100,
                    padding: EdgeInsets.all(5),
                    decoration: BoxDecoration(
                      color: Colors.greenAccent,
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    child: GestureDetector(
                      onTap: (){
                        print("lk");
                        String id = randomAlphaNumeric(10);
                        Map<String, dynamic>userTodo ={
                          "work":taskController.text,
                          "id": id,
                          "yes": false,
                        };
                        personal? DatabaseService()
                        .addPersonalTask(userTodo, id)
                        :college? DatabaseService()
                        .addCollegeTask(userTodo, id)
                        :DatabaseService().addOfficeTask(userTodo, id);
                        Navigator.pop(context);
                      },
                      child: Center(
                        child: Text(
                          "Add",
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                          )
                        ),
                      ),
                    )
                  ),
                )
              ],
            )
          ),
        )
      )
    );
  }
}