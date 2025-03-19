import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class EvaluatorDetailsPage extends StatefulWidget {
  const EvaluatorDetailsPage({super.key});

  @override
  State<EvaluatorDetailsPage> createState() => _EvaluatorDetailsPageState();
}

class _EvaluatorDetailsPageState extends State<EvaluatorDetailsPage> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [
          Text("Title"),
          const SizedBox(height: 10),
          TextField(
            decoration: InputDecoration(
                hintText: "Title",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                )),
          ),
          const SizedBox(height: 20),
          Text("Description (optional)"),
          const SizedBox(height: 10),
          TextField(
            decoration: InputDecoration(
                hintText: "Description (optional)",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                )),
            maxLines: 4,
          ),
          const SizedBox(height: 20),
          Text("Class"),
          const SizedBox(height: 10),
          DropdownButtonFormField(
            decoration: InputDecoration(
                hintText: "Class",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                )),
            items: [
              DropdownMenuItem(
                child: Text("Class 1"),
                value: 1,
              ),
              DropdownMenuItem(
                child: Text("Class 2"),
                value: 2,
              ),
            ],
            onChanged: (value) {},
          ),
          const SizedBox(height: 20),
          TextButton.icon(
            onPressed: () {},
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
            onPressed: () {},
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
