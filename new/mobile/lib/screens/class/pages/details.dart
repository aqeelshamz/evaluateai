import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class ClassDetailsPage extends StatefulWidget {
  const ClassDetailsPage({super.key});

  @override
  State<ClassDetailsPage> createState() => _ClassDetailsPageState();
}

class _ClassDetailsPageState extends State<ClassDetailsPage> {
  TextEditingController nameController = TextEditingController();
  TextEditingController sectionController = TextEditingController();
  TextEditingController subjectController = TextEditingController();

  @override
  void initState() {
    getData();
    super.initState();
  }

  void getData() async {
    var classProvider =
        Provider.of<ClassesProvider>(Get.context!, listen: false);
    await classProvider.getClass();
    nameController.text = classProvider.classData["name"];
    sectionController.text = classProvider.classData["section"];
    subjectController.text = classProvider.classData["subject"];
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [
          Text("Name"),
          const SizedBox(height: 10),
          TextField(
            controller: nameController,
            decoration: InputDecoration(
              hintText: "Class name",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text("Section"),
          const SizedBox(height: 10),
          TextField(
            controller: sectionController,
            decoration: InputDecoration(
              hintText: "Section",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text("Subject"),
          const SizedBox(height: 10),
          TextField(
            controller: subjectController,
            decoration: InputDecoration(
              hintText: "Subject",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          const SizedBox(height: 20),
          TextButton.icon(
            onPressed: () {
              // Provider.of<ClassesProvider>(context, listen: false)
              //     .updateClass();
            },
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: primaryColor,
              foregroundColor: Colors.white,
            ),
            icon: Icon(FeatherIcons.save),
            label: Text("Save"),
          ),
          const SizedBox(height: 10),
          TextButton.icon(
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
                          Text("Delete Class"),
                        ],
                      ),
                      content: Text(
                        "Are you sure you want to delete this class?",
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
                            // Provider.of<ClassesProvider>(context, listen: false)
                            //     .deleteClass();
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
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: Colors.white,
            ),
            icon: Icon(FeatherIcons.trash2),
            label: Text("Delete"),
          ),
        ],
      ),
    );
  }
}
