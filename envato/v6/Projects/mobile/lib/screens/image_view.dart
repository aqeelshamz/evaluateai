import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class ImageView extends StatefulWidget {
  final String imageUrl;
  const ImageView({super.key, required this.imageUrl});

  @override
  State<ImageView> createState() => _ImageViewState();
}

class _ImageViewState extends State<ImageView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.black,
        width: Get.width,
        height: Get.height,
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                    icon:
                        const Icon(FeatherIcons.arrowLeft, color: Colors.white),
                    onPressed: () {
                      Get.back();
                    },
                  ),
                ],
              ),
              Expanded(
                child: Center(
                  child: Image.network(widget.imageUrl),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
