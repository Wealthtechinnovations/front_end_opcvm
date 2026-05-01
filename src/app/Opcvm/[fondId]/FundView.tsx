"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSquare } from '@fortawesome/free-solid-svg-icons';
import Header from '../../Header'
import { urlconstant, urlsite } from "@/app/constants";
import { extractIdFromSlug } from "@/lib/utils";
import ExportModal from './exportmodal';
import { Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Head from 'next/head';
import SEO from '@/components/common/SEO';
import { fundSchema, breadcrumbSchema } from '@/utils/structuredData';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Swal from 'sweetalert2';