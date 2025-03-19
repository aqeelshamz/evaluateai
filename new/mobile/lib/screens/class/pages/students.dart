import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/providers/user.dart';
import 'package:evaluateai/screens/class/pages/add_student.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class StudentsPage extends StatefulWidget {
  const StudentsPage({super.key});

  @override
  State<StudentsPage> createState() => _StudentsPageState();
}

class _StudentsPageState extends State<StudentsPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var classesProvider = Provider.of<ClassesProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              Icon(FeatherIcons.users),
              const SizedBox(width: 10),
              Text(
                "Students",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: ListView.builder(
              itemCount: classesProvider.classData["students"].length,
              itemBuilder: (context, index) {
                return ListTile(
                  leading: Text(
                      "${classesProvider.classData["students"][index]["rollNo"]}"),
                  title: Text(
                      classesProvider.classData["students"][index]["name"]),
                  subtitle: Text(
                      classesProvider.classData["students"][index]["email"]),
                  trailing: IconButton(
                    icon: Icon(FeatherIcons.trash),
                    onPressed: () {
                      showDialog(
                          context: context,
                          builder: (context) {
                            return AlertDialog(
                              title: Row(
                                children: [
                                  Icon(FeatherIcons.trash2),
                                  const SizedBox(
                                    width: 5,
                                  ),
                                  Text("Delete Student"),
                                ],
                              ),
                              content: Text(
                                "Are you sure you want to delete this student?",
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () {
                                    Get.back();
                                  },
                                  child: Text("Cancel"),
                                ),
                                TextButton(
                                  onPressed: () {
                                    Provider.of<ClassesProvider>(context,
                                            listen: false)
                                        .deleteStudent(classesProvider
                                                .classData["students"][index]
                                            ["rollNo"]);
                                  },
                                  child: Text(
                                    "Delete",
                                    style: TextStyle(
                                      color: Colors.red,
                                    ),
                                  ),
                                ),
                              ],
                            );
                          });
                    },
                  ),
                );
              },
            ),
          ),
          Row(
            children: [
              Expanded(
                child: TextButton.icon(
                  onPressed: () {
                    Get.to(() => AddStudentScreen());
                  },
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 15),
                    backgroundColor: primaryColor,
                    foregroundColor: Colors.white,
                  ),
                  icon: Icon(FeatherIcons.plus),
                  label: Text("New Student"),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
