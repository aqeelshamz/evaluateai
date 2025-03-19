import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class NewEditEvaluatorPage extends StatefulWidget {
  const NewEditEvaluatorPage({super.key});

  @override
  State<NewEditEvaluatorPage> createState() => _NewEditEvaluatorPageState();
}

class _NewEditEvaluatorPageState extends State<NewEditEvaluatorPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          width: Get.width,
          height: Get.height,
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(FeatherIcons.play),
                  const SizedBox(width: 10),
                  Text(
                    "New Evaluator",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView(
                  children: [
                    Text("Title"),
                    const SizedBox(height: 10),
                    TextField(
                      decoration: InputDecoration(
                        hintText: "Title",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        )
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text("Description (optional)"),
                    const SizedBox(height: 10),
                    TextField(
                      decoration: InputDecoration(
                        hintText: "Description (optional)",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        )
                      ),
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
                        )
                      ),
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
                  ],
                )
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () {},
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 15),
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                      ),
                      child: Text("Create Evaluator"),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
