import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class AddStudentScreen extends StatefulWidget {
  const AddStudentScreen({super.key});

  @override
  State<AddStudentScreen> createState() => _AddStudentScreenState();
}

class _AddStudentScreenState extends State<AddStudentScreen> {
  TextEditingController nameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController rollNoController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          width: Get.width,
          height: Get.height,
          padding: const EdgeInsets.all(20),
          child: ListView(
            children: [
              Row(
                children: [
                  GetPlatform.isIOS
                      ? IconButton(
                          onPressed: () {
                            Get.back();
                          },
                          icon: Icon(FeatherIcons.arrowLeft),
                        )
                      : const SizedBox.shrink(),
                  Icon(FeatherIcons.userPlus),
                  const SizedBox(width: 10),
                  Text(
                    "Add Student",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text("Name"),
              const SizedBox(height: 10),
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  hintText: "Name",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text("Email"),
              const SizedBox(height: 10),
              TextField(
                keyboardType: TextInputType.emailAddress,
                controller: emailController,
                decoration: InputDecoration(
                  hintText: "Email",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text("Roll No"),
              const SizedBox(height: 10),
              TextField(
                keyboardType: TextInputType.number,
                controller: rollNoController,
                decoration: InputDecoration(
                  hintText: "Roll No",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: () {},
                style: TextButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 15),
                  backgroundColor: primaryColor,
                  foregroundColor: Colors.white,
                ),
                child: Text("Add Student"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
